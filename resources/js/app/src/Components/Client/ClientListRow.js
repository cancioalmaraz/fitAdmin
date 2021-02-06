import React, { Fragment } from "react";
import { TableCell, TableRow } from "@material-ui/core";

const ClientListRow = ({ client }) => {

    const styles = {
        row: {
            backgroundColor: client.remaining_days < 7 ? 'red' : 'white'
        },
        cell: {
            color: client.remaining_days < 7 ? 'white' : 'black'
        }
    };

    return (
        <TableRow style={styles.row}>
            <TableCell style={styles.cell} align="center">{client.ci}</TableCell>
            <TableCell style={styles.cell} align="center">{client.name}</TableCell>
            <TableCell style={styles.cell} align="center">{client.firtst_last_name}</TableCell>
            <TableCell style={styles.cell} align="center">{client.second_last_name}</TableCell>
            <TableCell style={styles.cell} align="center">
                {!!client.remaining_days && client.remaining_days}
            </TableCell>
            <TableCell style={styles.cell} align="center">
                {!!client.phone && client.phone}
            </TableCell>
            <TableCell style={styles.cell} align="center">
                {!!client.coach && client.coach.name}
            </TableCell>
            <TableCell style={styles.cell} align="center">
                acciones
            </TableCell>
        </TableRow>
    );
};

export default ClientListRow;
