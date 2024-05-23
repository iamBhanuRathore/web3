import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className: string;
};
const AnimatedButton = ({ className, ...props }: Props) => {
  return (
    <button className={className} {...props}>
      <span>Button</span>
      <i></i>
    </button>
  );
};

export default AnimatedButton;
