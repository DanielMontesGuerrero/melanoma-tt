import CustomProviderProps from "./customProviderProps";
import CurrentPictureMediaProvider from "./pictureMediaContext";
import PrediagnosisResultProvider from "./prediagnosisResultContext";
import ReduxProvider from "./reduxProvider";
import UserProvider from "./userContext";

const Providers = ({ children }: CustomProviderProps) => {
  return (
    <CurrentPictureMediaProvider>
      <PrediagnosisResultProvider>
        <ReduxProvider>
          <UserProvider>{children}</UserProvider>
        </ReduxProvider>
      </PrediagnosisResultProvider>
    </CurrentPictureMediaProvider>
  );
};

export default Providers;
