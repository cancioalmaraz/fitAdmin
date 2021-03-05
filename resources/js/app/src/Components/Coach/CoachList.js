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
import CoachListRow from "./CoachListRow";

const useStyles = makeStyles(theme => ({
    tableHead: {
        backgroundColor: "rgb(63, 81, 181)"
    },
    tableCell: {
        color: "white"
    }
}));

const CoachList = React.memo(
    ({ coachList = { data: [], loading: false }, actionList = {} }) => {
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
                                    Telefono
                                </TableCell>
                                <TableCell
                                    className={classes.tableCell}
                                    align="center"
                                >
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                    </Hidden>
                    <TableBody>
                        {!coachList.loading &&
                            coachList.data.map(coach => (
                                <CoachListRow
                                    key={coach.id}
                                    coach={coach}
                                    actionList={actionList}
                                />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
);

export default CoachList;
