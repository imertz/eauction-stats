import React from "react";

const GlassCard = (props: { no_katakyrwsi: string }) => {
  console.log(props);

  return (
    <button className="glass-card h-max w-full p-4 mt-4 text-white">
      <p className="font-extrabold">{props.no_katakyrwsi}</p>
      <p className="text-xs ">
        <span className="font-extralight">Αρχ.Τιμή: </span>
        <span className="font-bold">900.000,00 €</span>
      </p>
      <p className="text-xs ">
        <span className="font-extralight">Είδος: </span>
        <span className="font-bold">Κατάστημα</span>
      </p>
      <p className="text-xs ">
        <span className="font-extralight">Περιφέρεια: </span>
        <span className="font-bold">Κυκλάδων</span>
      </p>
      <p className="text-xs">
        <span className="font-extralight">Δήμος: </span>
        <span className="font-bold">Μυκόνου</span>
      </p>
      <p className="text-xs">
        <span className="font-bold">19.12.2021</span>
      </p>
      {/* <a href="http://example.com">Example</a> */}
    </button>
  );
};

export default GlassCard;
