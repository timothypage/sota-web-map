import { useState, useCallback, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import classnames from "classnames";
import { measureGPX } from "/src/helpers/load-gpx";

import { useDropzone } from "react-dropzone";

import { BsChevronRight, BsChevronLeft } from "react-icons/bs";

import GpxSummary from "/src/components/GpxSummary";

import styles from "./MyStuff.module.css";

const MyStuff = () => {
  const auth = useAuth();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const token = auth.user?.access_token;

  useEffect(() => {
    async function fetchData() {
      if (!auth.isAuthenticated) return;

      const existingFiles = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user-files`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((r) => r.json());

      setFiles((state) => existingFiles);
      setIsUploading(false);
    }
    fetchData();
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      for (const file of acceptedFiles) {
        let gpx_info = null;
        try {
          gpx_info = await file.text().then((f) => measureGPX(f));
        } catch (e) {
          console.log("Couldn't measureGPX", e);
        }

        try {
          let formData = new FormData();
          formData.append("file", file);

          const resp = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/user-files`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              method: "post",
              body: JSON.stringify({ filename: file.name, gpx_info }),
            }
          ).then((r) => r.json());

          await fetch(resp.upload_url, {
            body: file,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              // "Content-Type": "multipart/form-data",
            },
            method: "put",
          });

          setFiles((state) => [...state, resp]);
        } catch (e) {
          console.error("error uploading files", e);
        }
      }
    },
    [auth]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const [expanded, setExpanded] = useState(import.meta.env.DEV);

  return (
    <div
      className={classnames(styles.myStuff, { [styles.expanded]: expanded })}
    >
      {expanded ? (
        <div className={styles.expandedContent}>
          <div className={styles.exandedStuff}>
            <h2>My Stuff</h2>
            <div className={styles.filesList}>
              {files.map((file) => (
                <GpxSummary key={file.id} file={file} />
              ))}
            </div>
            <div {...getRootProps()} className={styles.upload}>
              <input {...getInputProps()} />
              {isDragActive ? <p>Drop...</p> : <p>Upload .gpx</p>}
            </div>
          </div>
          <div
            className={styles.collapseMe}
            onClick={() => setExpanded((state) => !state)}
          >
            <BsChevronLeft />
          </div>
        </div>
      ) : (
        <div
          className={styles.expandMe}
          onClick={() => setExpanded((state) => !state)}
        >
          <BsChevronRight />
        </div>
      )}
    </div>
  );
};

export default MyStuff;
