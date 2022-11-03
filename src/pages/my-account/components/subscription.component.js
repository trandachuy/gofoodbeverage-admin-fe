import BillingComponent from "pages/billing/components/billing.component";
import React from "react";
import PackageTable from "./package-table.component";
import "./subscription.component.scss";

export const SubscriptionComponent = (props) => {
  const { userInformation } = props;
  const [showListPackage, setShowListPackage] = React.useState(true);

  return (
    <>
      {showListPackage ? (
        <PackageTable showBillingComponent={() => setShowListPackage(false)} />
      ) : (
        <div className="account-subscription">
          <BillingComponent userInfo={userInformation} />
        </div>
      )}
    </>
  );
};
