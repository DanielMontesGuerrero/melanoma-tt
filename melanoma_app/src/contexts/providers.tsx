import CustomProviderProps from "./customProviderProps";
import CurrentPictureMediaProvider from "./pictureMediaContext";
import ReduxProvider from "./reduxProvider";

const Providers = ({ children }: CustomProviderProps) => {
  return (
  <CurrentPictureMediaProvider>
    <ReduxProvider>
      {children}
    </ReduxProvider>
  </CurrentPictureMediaProvider>
  );
};

export default Providers;
