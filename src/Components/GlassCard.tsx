import React from "react";
import translations from "../translate";

const GlassCard = (props: {
  no_katakyrwsi: number;
  xaraktiristika: string;
  imnia: string;
  no_prwti: number;
  link: string;
  q: string;
}) => {
  const handleClick = async () => {
    window.open(props.link, "_blank");

    try {
      await fetch("https://api.mysolon.gr", {
        method: "POST",
        body: JSON.stringify({
          q: props.q,
          l: props.link.split("/").at(-1),
          s: sessionStorage.getItem("uuid"),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <button
      className="glass-card h-max w-full p-4 mt-4 text-white"
      onClick={handleClick}
    >
      <p className="font-extrabold">
        {new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: "EUR",
        }).format(props.no_katakyrwsi / 100)}
      </p>
      <p className="text-xs ">
        <span className="font-extralight">Αρχ.Τιμή: </span>
        <span className="font-bold">
          {new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
          }).format(props.no_prwti / 100)}
        </span>
      </p>
      <p className="text-xs ">
        <span className="font-extralight">Είδος: </span>
        <span className="font-bold">
          {" "}
          {props.xaraktiristika.split(" - ")?.[0]}
        </span>
      </p>
      <p className="text-xs ">
        <span className="font-extralight">Περιφέρεια: </span>
        <span className="font-bold">
          {" "}
          {props.xaraktiristika.split(" - ")?.[1]}
        </span>
      </p>
      <p className="text-xs">
        <span className="font-extralight">Δήμος: </span>
        <span className="font-bold">
          {props.xaraktiristika.split(" - ")?.[2]}
        </span>
      </p>
      <p className="text-xs">
        <span className="font-bold">{props.imnia}</span>
      </p>
      {/* <a href="http://example.com">Example</a> */}
    </button>
  );
};

export const GlassCardEnglish = (props: {
  no_katakyrwsi: number;
  xaraktiristika: string;
  imnia: string;
  no_prwti: number;
  link: string;
  q: string;
}) => {
  const handleClick = async () => {
    window.open(props.link, "_blank");

    try {
      await fetch("https://api.mysolon.gr", {
        method: "POST",
        body: JSON.stringify({
          q: props.q,
          l: props.link.split("/").at(-1),
          s: sessionStorage.getItem("uuid"),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <button
      className="glass-card h-max w-full p-4 mt-4 text-white"
      onClick={handleClick}
    >
      <p className="font-extrabold">
        {new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: "EUR",
        }).format(props.no_katakyrwsi / 100)}
      </p>
      <p className="text-xs ">
        <span className="font-extralight">Starting Price: </span>
        <span className="font-bold">
          {new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
          }).format(props.no_prwti / 100)}
        </span>
      </p>
      <p className="text-xs ">
        <span className="font-extralight">Type: </span>
        <span className="font-bold">
          {" "}
          {translations[props.xaraktiristika.split(" - ")?.[0]]
            ? translations[props.xaraktiristika.split(" - ")?.[0]]
            : props.xaraktiristika.split(" - ")?.[0]}
        </span>
      </p>
      <p className="text-xs ">
        <span className="font-extralight">Region: </span>
        <span className="font-bold">
          {" "}
          {translations[props.xaraktiristika.split(" - ")?.[1]]
            ? translations[props.xaraktiristika.split(" - ")?.[1]]
            : props.xaraktiristika.split(" - ")?.[1]}
        </span>
      </p>
      <p className="text-xs">
        <span className="font-extralight">Municipality: </span>
        <span className="font-bold">
          {translations[props.xaraktiristika.split(" - ")?.[2]]
            ? translations[props.xaraktiristika.split(" - ")?.[2]]
            : props.xaraktiristika.split(" - ")?.[2]}
        </span>
      </p>
      <p className="text-xs">
        <span className="font-bold">{props.imnia}</span>
      </p>
      {/* <a href="http://example.com">Example</a> */}
    </button>
  );
};

export default GlassCard;
