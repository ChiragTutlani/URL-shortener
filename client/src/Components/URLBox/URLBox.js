import React from "react";
import "./URLBox.css";

const URLBox = ({ timesUsed, createdAt, originalUrl, shortUrl, refresh }) => {
  return (
    <div className="url-box">
      <p className="short-url">
        Short URL:{" "}
        <a onClick={() => refresh()} href={shortUrl} target="_blank">
          {shortUrl}
        </a>
      </p>
      <p className="original-url">Original URL: {originalUrl}</p>
      <div className="url-details">
        <p>{`Created at ${createdAt}`}</p>
        <p>{`${timesUsed} time${timesUsed > 1 ? "s" : ""} used`}</p>
      </div>
    </div>
  );
};

export default URLBox;
