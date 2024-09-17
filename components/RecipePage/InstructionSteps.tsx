export default function InstructionSteps({
  instructions,
}: {
  instructions: string;
}) {
  const steps = JSON.parse(instructions);

  return (
    <div className="mb-8 max-w-2xl ">
      <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
      <ol className="space-y-4">
        {steps.map((step: string, index: number) => (
          <li key={index}>
            <span className="font-medium">Step {index + 1}:</span> {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
