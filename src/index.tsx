import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import styled from "styled-components";
import GlassmorphicCard from "./components/ui/GlassmorphicCard";
import backgroundImage from "./assets/images/Image.jpg";

// Define the props interface for BackgroundWrapper
interface BackgroundWrapperProps {
	img: string;
}

const BackgroundWrapper = styled.div<BackgroundWrapperProps>`
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: auto;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(${(props) => props.img});
    background-size: cover;
    background-position: center;
    z-index: -1;
  }

  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: -1;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  width: 90%;
  max-width: 1200px;
`;

// Create a context for the GlassmorphicCard
export const GlassmorphicCardContext = React.createContext(GlassmorphicCard);

ReactDOM.render(
	<React.StrictMode>
		<BackgroundWrapper img={backgroundImage}>
			<ContentWrapper>
				<GlassmorphicCardContext.Provider value={GlassmorphicCard}>
					<App />
				</GlassmorphicCardContext.Provider>
			</ContentWrapper>
		</BackgroundWrapper>
	</React.StrictMode>,
	document.getElementById("root"),
);
