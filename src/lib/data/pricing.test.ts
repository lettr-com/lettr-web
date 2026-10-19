import { describe, expect, it } from "vite-plus/test";

import { comparisonRows, planVolumes, transactionalPlans, transactionalSteps } from "./pricing";

describe("transactional pricing", () => {
  it("states each paid plan's full slider range in the comparison table", () => {
    expect(planVolumes("pro")).toBe("50K–100K emails");
    expect(planVolumes("business")).toBe("200K–1M emails");
    expect(comparisonRows[0].values.slice(1, 3)).toEqual([
      planVolumes("pro"),
      planVolumes("business"),
    ]);
  });

  it("shows the selected slider volume on the matching plan card", () => {
    transactionalSteps.forEach((step, index) => {
      if (step.plan !== "pro" && step.plan !== "business") return;
      const card = transactionalPlans(index).find((plan) => plan.key === step.plan);
      expect(card?.blurb).toMatch(new RegExp(`^${step.label.toUpperCase()} emails`));
      expect(card?.price).toBe(step.price);
    });
  });
});
