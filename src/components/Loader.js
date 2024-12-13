import React from "react";
import PulseLoader from "react-spinners/PulseLoader";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <PulseLoader color="#0052ec" size={15} margin={2} />
    </div>
  );
};

export default Loader;
