const BASE = "https://agent.tinyfish.ai";
const SUBMIT_ENDPOINT = `${BASE}/v1/automation/run-async`;
const STATUS_ENDPOINT = (runId) => `${BASE}/v1/runs/${runId}`;
const CANCEL_ENDPOINT = (runId) => `${BASE}/v1/runs/${runId}/cancel`;

const POLL_INTERVAL_MS = parseInt(process.env.TINYFISH_POLL_INTERVAL || "5000", 10);
const JOB_TIMEOUT_MS   = parseInt(process.env.TINYFISH_TIMEOUT     || "600000", 10);

async function submitJob(url, goal, browserProfile = "lite") {
  const res = await fetch(SUBMIT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.TINYFISH_API_KEY,
    },
    body: JSON.stringify({ url, goal, browser_profile: browserProfile }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TinyFish submit HTTP ${res.status}: ${text}`);
  }

  const { run_id, error } = await res.json();
  if (error) throw new Error(`TinyFish submit error: ${error}`);
  return run_id;
}

async function cancelRun(runId) {
  try {
    await fetch(CANCEL_ENDPOINT(runId), {
      method: "POST",
      headers: { "X-API-Key": process.env.TINYFISH_API_KEY },
    });
    console.log(`[TinyFish] Cancelled run ${runId}`);
  } catch (err) {
    console.warn(`[TinyFish] Failed to cancel run ${runId}:`, err.message);
  }
}

async function pollUntilDone(runId, url, controller) {
  const deadline = Date.now() + JOB_TIMEOUT_MS;

  while (Date.now() < deadline) {
    if (controller?.stopped) {
      await cancelRun(runId);
      return { url, matches: [], error: "Scan stopped" };
    }

    await controller?.waitIfPaused();

    if (controller?.stopped) {
      await cancelRun(runId);
      return { url, matches: [], error: "Scan stopped" };
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    if (controller?.stopped) {
      await cancelRun(runId);
      return { url, matches: [], error: "Scan stopped" };
    }

    let data;
    try {
      const res = await fetch(STATUS_ENDPOINT(runId), {
        headers: { "X-API-Key": process.env.TINYFISH_API_KEY },
      });
      if (!res.ok) {
        console.warn(`[TinyFish] Poll ${runId} HTTP ${res.status} — retrying`);
        continue;
      }
      data = await res.json();
    } catch (err) {
      console.warn(`[TinyFish] Poll ${runId} network error — retrying:`, err.message);
      continue;
    }

    const { status, result, error } = data;

    if (status === "COMPLETED") {
      const matches = Array.isArray(result)
        ? result
        : result?.matches ?? [];
      return { url, matches, raw: { ...data, final_url: data.final_url ?? data.page_url ?? null } };
    }

    if (status === "FAILED" || status === "CANCELLED") {
      console.error(`[TinyFish] Run ${runId} ${status}: ${error ?? ""}`);
      return { url, matches: [], error: `Run ${status.toLowerCase()}${error ? ": " + error : ""}` };
    }
  }

  console.error(`[TinyFish] Run ${runId} timed out after ${JOB_TIMEOUT_MS / 1000}s`);
  return { url, matches: [], error: "Timed out" };
}

export async function bulkScrapeForInfringement(targets, controller) {
  const submissions = await Promise.all(
    targets.map(async ({ url, goal }) => {
      if (controller?.stopped) {
        return { url, runId: null, error: "Scan stopped" };
      }
      try {
        const runId = await submitJob(url, goal);
        console.log(`[TinyFish] Submitted ${url} → run_id ${runId}`);
        controller?.runIds.add(runId);
        return { url, runId };
      } catch (err) {
        console.error(`[TinyFish] Failed to submit ${url}:`, err.message);
        return { url, runId: null, error: err.message };
      }
    })
  );

  const results = await Promise.all(
    submissions.map(({ url, runId, error }) => {
      if (!runId) return Promise.resolve({ url, matches: [], error });
      return pollUntilDone(runId, url, controller);
    })
  );

  return results;
}
