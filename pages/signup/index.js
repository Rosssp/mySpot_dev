import React from "react";
import Spacer from "components/UI/spacer/spacer";
import SignUpFrom from "/components/SignUpFrom/signUpFrom";

export default function SignIn() {
    return (
        <div style={{ height: "100vh" }}>
            <Spacer size={"xl"} />
            <div
                className="main__wrapper"
                style={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <SignUpFrom />
            </div>
        </div>
    );
}
