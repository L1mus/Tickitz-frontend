const Stepper = ({ steps = [], activeStep = 0, showCheck = false }) => {
  return (
    <div className="relative flex w-full items-center justify-between">
      <div className="absolute top-6 right-0 left-0 z-0 border-t-2 border-dashed border-gray-300"></div>

      {steps.map((step, index) => {
        const isCompleted = index < activeStep;
        const isActive = index === activeStep;

        return (
          <div
            key={index}
            className="relative z-10 flex flex-col items-center justify-center bg-white px-2"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold text-white transition-colors ${
                isCompleted
                  ? 'bg-[#00BA88]'
                  : isActive
                    ? 'bg-blue-700'
                    : 'bg-gray-300 text-gray-600'
              }`}
            >
              {isCompleted && showCheck ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span
              className={`mt-3 text-sm font-medium transition-colors ${
                isActive ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
