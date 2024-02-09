import React, { useEffect, useRef, useState } from "react";
import styles from "./addNewSpot.module.scss";
import DefaultButton from "../UI/defaultButton/defaultButton";
import CreateSpotFrom from "../CreateSpotFrom/createSpotFrom";
import { CSSTransition } from "react-transition-group";
import animationStyles from "./animation.module.scss";
import MyContext from "../../context/formCloseContext";

export default function AddNewSpot({ latlnd }) {
    const [newSpot, setNewSpot] = useState(false);
    const [addNewSpot, setAddNewSpot] = useState(false);
    const popupRef = useRef(null);

    const contentAnimation = {
        enter: animationStyles.contentEnter,
        enterActive: animationStyles.contentEnterActive,
        exit: animationStyles.contentExit,
        exitActive: animationStyles.contentExitActive,
    };

    return (
        <>
            <div className={styles.add_spot}>
                <div className={styles.buttons}>
                    {newSpot === false ? (
                        <DefaultButton
                            handleClick={(e) => {
                                e.preventDefault();
                                setNewSpot(true);
                            }}
                            type={"default"}
                        >
                            <p>ДОБАВИТЬ СПОТ</p>
                        </DefaultButton>
                    ) : (
                        <>
                            {!addNewSpot && (
                                <DefaultButton
                                    handleClick={() => setAddNewSpot(true)}
                                    type={"default"}
                                >
                                    <p>ДА</p>
                                </DefaultButton>
                            )}
                            <DefaultButton
                                handleClick={(e) => {
                                    e.preventDefault();
                                    setNewSpot(false);
                                    setAddNewSpot(false);
                                }}
                                type={"default"}
                            >
                                <p>НЕТ</p>
                            </DefaultButton>
                        </>
                    )}
                </div>
            </div>
            {newSpot && (
                <div className={styles.placeMark}>
                    <h1>•</h1>
                </div>
            )}
            <CSSTransition
                in={addNewSpot}
                nodeRef={popupRef}
                timeout={300}
                mountOnEnter
                unmountOnExit
                classNames={contentAnimation}
                onEnter={() => setAddNewSpot(true)}
                onExited={() => setAddNewSpot(false)}
            >
                <MyContext.Provider value={{ addNewSpot, setAddNewSpot }}>
                    <div className={styles.spotPopup} ref={popupRef}>
                        <p>.</p>
                        <CreateSpotFrom latlnd={latlnd} close={setAddNewSpot} />
                    </div>
                </MyContext.Provider>
            </CSSTransition>
        </>
    );
}
