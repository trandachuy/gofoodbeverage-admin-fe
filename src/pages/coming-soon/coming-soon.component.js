import React, { useEffect, useState } from "react";
import { Image } from "antd";
import "./style.scss";
import VersionImage from "assets/coming-soon/coming-soon.png";
export default function ComingSoon(props, { router }) {
    const [version, setVersion] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setVersion(urlParams.get("version_support"));
    }, []);

    return (
        <div className="page-coming-soon">
            <div className="page-background">
                <div className="version-image">
                    <Image preview={false} src={VersionImage} />
                    <div className="version-text">Version {version}</div>
                </div>
            </div>
        </div>
    )
}