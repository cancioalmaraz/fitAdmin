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

const ClientList = ({ clientList = { data: [] } }) => {
    return (
        <TableContainer>
            <Table>
                <Hidden smDown>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center">Id</TableCell>
                            <TableCell align="center">Description</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Progress</TableCell>
                            <TableCell align="center">Code</TableCell>
                            <TableCell align="center">Started At</TableCell>
                            <TableCell align="center">Finished At</TableCell>
                            <TableCell align="center">Priority</TableCell>
                            <TableCell align="center">Type</TableCell>
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
};

export default ClientList;
