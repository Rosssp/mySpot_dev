"use client";
import styles from "./map.module.scss";
import Head from "next/head";
import React, { useEffect, useState, useRef, useMemo } from "react";
import ReactDOM from "react-dom";
import MarkPopup from "@/components/MarkPopup/markPopup";
import AddNewSpot from "../../components/AddNewSpot/addNewSpot";
import axios from "axios";
import { motion } from "framer-motion";
// import { useGeolocated } from "react-geolocated";

export default function index({ data }) {
    // const [spots, setSpots] = useState(data);
    const spots = useMemo(() => data, [data]);
    console.log(spots);

    const [YMaps, setYMaps] = useState(<div />);
    const [getZoom, setGetZoom] = useState(17);
    const [getCoords, setGetCoords] = useState([0, 0]);
    const [getCenterCoords, setGetCenterCoords] = useState([0, 0]);
    const map = useRef(null);

    const handleGetCoords = (coords) => {
        setGetCoords(coords?.entity?.geometry?.coordinates);
    };
    const GetCenterCoords = (coords) => {
        setGetCenterCoords(coords?.location?.center);
    };
    const handleZoomChange = (zoom) => {
        setGetZoom(zoom?.location?.zoom);
    };

    // const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    //     useGeolocated({
    //         positionOptions: {
    //             enableHighAccuracy: true,
    //         },
    //         userDecisionTimeout: 5000,
    //     });
    // console.log("coords", isGeolocationAvailable, coords);
    // console.log(
    //     "webAPI",
    //     navigator?.geolocation?.getCurrentPosition((position) => {
    //         doSomething(position.coords.latitude, position.coords.longitude);
    //     })
    // );

    useEffect(() => {
        (async () => {
            try {
                const ymaps3 = window.ymaps3;
                const [ymaps3React] = await Promise.all([
                    ymaps3.import("@yandex/ymaps3-reactify"),
                    ymaps3.ready,
                ]);
                const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);
                const {
                    YMap,
                    YMapLayer,
                    YMapDefaultSchemeLayer,
                    YMapDefaultFeaturesLayer,
                    YMapFeatureDataSource,
                    YMapMarker,
                    YMapControls,
                    geolocation,
                    YMapListener,
                } = reactify.module(ymaps3);
                const { YMapGeolocationControl } = reactify.module(
                    await ymaps3.import("@yandex/ymaps3-controls@0.0.1")
                );
                const { YMapClusterer, clusterByGrid } = reactify.module(
                    await ymaps3.import("@yandex/ymaps3-clusterer@0.0.1")
                );
                const myCoords = await geolocation.getPosition();

                const points = spots.map((lnglat, i) => ({
                    type: "Feature",
                    id: i,
                    geometry: { coordinates: lnglat.coords },
                    properties: { name: "Point of issue of orders" },
                    ...lnglat,
                }));

                const cluster = (coordinates, items) => (
                    <YMapMarker coordinates={coordinates}>
                        <p className={styles.spot__mark}>{items.length}</p>
                    </YMapMarker>
                );

                const marker = (item) => (
                    <YMapMarker coordinates={item.coords}>
                        <MarkPopup
                            id={item.id}
                            title={item?.title}
                            score={item?.ratings_avg}
                        />
                    </YMapMarker>
                );

                setYMaps(() => (
                    <YMap
                        location={{
                            center: !myCoords.coords
                                ? [39.720349, 47.222078]
                                : myCoords.coords,
                            zoom: getZoom,
                        }}
                        camera={{ tilt: 0, azimuth: 0, duration: 10 }}
                        ref={map}
                    >
                        <YMapDefaultSchemeLayer />
                        <YMapFeatureDataSource id={"my-source"} />
                        <YMapDefaultFeaturesLayer />
                        <YMapLayer />

                        <YMapMarker coordinates={myCoords.coords}>
                            <p className={styles.spot__mark}>Я</p>
                        </YMapMarker>
                        <YMapListener
                            layer={"any"}
                            onClick={handleGetCoords}
                            onActionStart={handleZoomChange}
                            onActionEnd={GetCenterCoords}
                        />

                        {/* {spots?.map((item) => (
                            <YMapMarker
                                coordinates={[item.coords[0], item.coords[1]]}
                            >
                                <MarkPopup
                                    id={item.id}
                                    title={item?.title}
                                    score={item?.ratings_avg}
                                />
                            </YMapMarker>
                        ))} */}

                        <YMapClusterer
                            method={clusterByGrid({ gridSize: 164 })}
                            features={points}
                            marker={marker}
                            cluster={cluster}
                        />

                        <YMapControls position="bottom right">
                            <YMapGeolocationControl />
                        </YMapControls>

                        {/* <div className={styles.addNewSpot}> */}
                        {/* </div> */}
                        {/* <YMapMarker
                            coordinates={!coords ? myCoords.coords : coords}
                        >
                            <p className={styles.spot__mark}>добавить спот?</p>
                        </YMapMarker> */}
                    </YMap>
                ));
            } catch (e) {
                setYMaps(<div />);
            }
        })();
        return () => {
            map.current = null;
        };
    }, []);
    return (
        <motion.div className={styles.mapWrapper}>
            <Head>
                <title>MY SPOT | SPOTS, СПОТЫ, СКЕЙТ-ПАРКИ</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta property="og:title" content="MY SPOT" key="title" />
            </Head>
            <div
                className={styles.map}
                style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
            >
                <AddNewSpot latlnd={getCenterCoords} />
                {YMaps}
            </div>
        </motion.div>
    );
}

export async function getServerSideProps({ params }) {
    try {
        const spots = await axios
            .get(process.env.NEXT_PUBLIC_API + "/api/spots.json")
            .then((response) => response?.data);

        return {
            props: {
                data: spots,
            },
        };
    } catch (error) {
        return { redirect: { destination: "/", permanent: false } };
    }
}
