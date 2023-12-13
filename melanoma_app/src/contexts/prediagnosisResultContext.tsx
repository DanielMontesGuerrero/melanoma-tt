import { createContext, useContext, useState } from "react";

import CustomProviderProps from "./customProviderProps";

import { ClassifyResponse } from "@/types/melanomaApiTypes";

interface PrediagnosisResultContextType {
  result: ClassifyResponse;
  setResult: (result: ClassifyResponse) => void;
}

const PrediagnosisResultContext = createContext<PrediagnosisResultContextType>({
  result: { score: 0, img: "" },
  setResult: () => null,
});

const PrediagnosisResultProvider = ({ children }: CustomProviderProps) => {
  const [result, setResult] = useState<ClassifyResponse>({ score: 0, img: "" });

  return (
    <PrediagnosisResultContext.Provider
      value={{
        result,
        setResult,
      }}
    >
      {children}
    </PrediagnosisResultContext.Provider>
  );
};

export const usePrediagnosisResult = () => {
  return useContext(PrediagnosisResultContext);
};

export default PrediagnosisResultProvider;
