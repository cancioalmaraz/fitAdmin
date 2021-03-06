import React from "react";
import {
    Hidden,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";

// Components
import ClientListRow from "./ClientListRow";

const useStyles = makeStyles(theme => ({
    tableHead: {
        backgroundColor: "rgb(63, 81, 181)"
    },
    tableCell: {
        color: "white"
    }
}));

const ClientList = React.memo(
    ({ clientList = { data: [], loading: false }, actionList = {} }) => {
        const classes = useStyles();

        return (
            <TableContainer>
                <Table>
                    <Hidden smDown>
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                <TableCell
                                    className={classes.tableCell}
                                    align="center"
                                >
                                    C.I.
                                </TableCell>
                                <TableCell
                                    className={classes.tableCell}
                                    align="center"
                                >
                                    Nombre
                                </TableCell>
                                <TableCell
                                    className={classes.tableCell}
                                    align="center"
                                >
                                    Apellido P.
                                </TableCell>
                                <TableCell
                                    className={classes.tableCell}
                                    align="center"
                                >
                                    Apellido M.
                                </TableCell>
                                <TableCell
                                    className={classes.tableCell}
                                    align="center"
                                >
                                    Dias Restantes
                                </TableCell>
                                <TableCell
                                    className={classes.tableCell}
                                    align="center"
                                >
                                    Telefono
                                </TableCell>
                                <TableCell
                                    className={classes.tableCell}
                                    align="center"
                                >
                                    Coach
                                </TableCell>
                                <TableCell
                                    className={classes.tableCell}
                                    align="center"
                                ></TableCell>
                            </TableRow>
                        </TableHead>
                    </Hidden>
                    <TableBody>
                        {!clientList.loading &&
                            clientList.data.map(client => (
                                <ClientListRow
                                    key={client.id}
                                    client={client}
                                    actionList={actionList}
                                />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
);

export default ClientList;
