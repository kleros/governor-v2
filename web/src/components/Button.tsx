import { ComponentProps } from "react";

const Button: React.FC<ComponentProps<"button">> = ({ children, ...props }) => {
  return (
    <button {...props} className="p-2 rounded-2xl border bg-purple-600 text-white cursor-pointer">
      {children}
    </button>
  );
};

export default Button;
