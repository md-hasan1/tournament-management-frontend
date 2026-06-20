interface SpinnerProps {
  size?: number; // pixel size for width/height
  className?: string; // optional extra classes
}

const Spinner = ({ size = 24, className = "" }: SpinnerProps) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center text-white ${className}`}
    >
      <div className="text-center">
        <div
          className="animate-spin rounded-full border-b-2 border-blue-500 mx-auto mb-4"
          style={{ width: size, height: size }}
        ></div>
      </div>
    </div>
  );
};

export default Spinner;
