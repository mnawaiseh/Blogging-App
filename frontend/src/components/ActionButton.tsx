"use client";

const ActionButton = ({ action, className, children }: any) => {
  const handleClick = async () => {
    await action();
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

export default ActionButton;
