// Renders a clean horizontal processing pipeline.
// steps: [{ label, sub, state }]
// state: "done" | "active" | "pending"

export default function Workflow({ steps = [] }) {
  return (
    <div className="workflow-flow">
      {steps.map((step, index) => (
        <div className="workflow-flow-group" key={step.label}>
          
          <div
            className={`workflow-flow-item workflow-flow-item--${
              step.state || "pending"
            }`}
          >
            <span className="workflow-flow-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="workflow-flow-content">
              <span className="workflow-flow-label">
                {step.label}
              </span>

              {step.sub && (
                <span className="workflow-flow-sub">
                  {step.sub}
                </span>
              )}
            </div>
          </div>

          {index < steps.length - 1 && (
            <span className="workflow-arrow" aria-hidden="true">
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}