import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const ClientDetailsDataTab = ({ client = {}, loading = false }) => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography>C.I : {client.ci}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>Nombre : {client.fullName}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>Telefono : {client.phone}</Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
                <Typography>
                    Fecha de Nacimiento :{" "}
                    {!!client.date_of_birth
                        ? client.date_of_birth
                        : "Sin fecha de nacimiento"}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Typography>Edad : {client.age}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    Coach :{" "}
                    {!!client.coach ? client.coach.fullName : "Sin coach"}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>Ubicacion:</Typography>
                {!loading ? (
                    <MapContainer
                        center={client.address}
                        zoom={15}
                        scrollWheelZoom
                        style={{
                            height: 400,
                            width: "100%"
                        }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={client.address}>
                            <Popup>Ubicacion</Popup>
                        </Marker>
                    </MapContainer>
                ) : (
                    <Skeleton variant="rect" height={400} />
                )}
            </Grid>
        </Grid>
    );
};

export default ClientDetailsDataTab;
