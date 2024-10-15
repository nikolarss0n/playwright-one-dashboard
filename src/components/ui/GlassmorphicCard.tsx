import type React from "react";
import styled from "styled-components";

const GlassmorphicCardWrapper = styled.div<{ $as: React.ElementType }>`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 4px 30px rgba(0, 0, 0, 0.1),
    inset 0 0 20px rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: rgba(255, 255, 255, 0.9);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    border-radius: 20px 20px 100% 100%;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 10px 40px rgba(0, 0, 0, 0.2),
      inset 0 0 30px rgba(255, 255, 255, 0.1);
  }
`;

interface GlassmorphicCardProps<T extends React.ElementType = "div"> {
	as?: T;
	children: React.ReactNode;
	className?: string;
}

const GlassmorphicCard = <T extends React.ElementType = "div">({
	as,
	children,
	className,
	...props
}: GlassmorphicCardProps<T> &
	Omit<React.ComponentPropsWithoutRef<T>, keyof GlassmorphicCardProps<T>>) => {
	return (
		<GlassmorphicCardWrapper
			as={as}
			$as={as || "div"}
			className={className}
			{...props}
		>
			{children}
		</GlassmorphicCardWrapper>
	);
};

export default GlassmorphicCard;
