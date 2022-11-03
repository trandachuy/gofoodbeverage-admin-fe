import adminBroadCast from "broadcast-channels/admin-broadcast-channel";
import { BroadcastActions } from "constants/vnpay-response-codes.constants";
import { useLocation } from "react-router-dom";
import React, { useEffect} from "react";

export default function TransferPayment(props) {
    const { search } = useLocation();
    const postMessage = (action, data) => {
        adminBroadCast?.postMessage({ action, data });
    };
    useEffect(() => {
        const query = new URLSearchParams(search);
        const vnPayForm = Object.fromEntries(query);
        postMessage(BroadcastActions, vnPayForm);
        window.close();
      }, [search]);
    return( <></>)
}