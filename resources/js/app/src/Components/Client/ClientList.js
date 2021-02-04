import React from "react";
import {
    Hidden,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";

// Components
import ClientListRow from "./ClientListRow";

const ClientList = React.memo(({ clientList = { data: [], loading: false } }) => {
    return (
        <TableContainer>
            <Table>
                <Hidden smDown>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Id</TableCell>
                            <TableCell align="center">Nombre</TableCell>
                            <TableCell align="center">Apellido P.</TableCell>
                            <TableCell align="center">Appelido M.</TableCell>
                            <TableCell align="center">Direccion</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Telefono</TableCell>
                            <TableCell align="center">Coach</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                </Hidden>
                <TableBody>
                    {clientList.data.map(client => (
                        <ClientListRow key={client.id} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
});

export default ClientList;
