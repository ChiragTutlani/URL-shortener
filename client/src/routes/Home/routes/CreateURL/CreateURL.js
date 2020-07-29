import React, { useState } from "react";
import Loader from "react-loader-spinner";
import axios from "axios";
import URLBox from "../../../../Components/URLBox/URLBox";
import "./CreateURL.css";

const CreateURL = () => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState("");
  const [response, setResponse] = useState({ success: false });

  const onCreateURL = async (e) => {
    e.preventDefault();

    try {
      setUrl("");
      setInfo("");
      setLoading(true);
      const res = await axios({
        url: "/api/url",
        method: "post",
        headers: {
          Accept: "application/json",
        },
        data: {
          originalUrl: url,
        },
      });
      setResponse(res.data);
    } catch (err) {
      setInfo("Problem occured. Please try again later.");
      setResponse({ success: false });
    }
    setLoading(false);
  };

  return (
    <div className="create-url-container container-lg">
      <form>
        <div className="form-group">
          <label htmlFor="inputUrl">
            URL <span className="required-symbol"> *</span>
          </label>
          <input
            onChange={(e) => setUrl(e.target.value)}
            value={url}
            type="url"
            className="form-control"
            id="inputUrl1"
            required
          />
        </div>
        {loading ? (
          <Loader
            className="text-center"
            type="Rings"
            color="#00BFFF"
            height={60}
            width={60}
          />
        ) : (
          <p className="text-center alert-danger">{info}</p>
        )}
        <button
          onClick={(e) => onCreateURL(e)}
          type="submit"
          className="btn btn-primary"
        >
          Create the short URL
        </button>
      </form>
      <div className="response">
        {response.success ? <URLBox {...response.data} /> : null}
      </div>
    </div>
  );
};

export default CreateURL;
