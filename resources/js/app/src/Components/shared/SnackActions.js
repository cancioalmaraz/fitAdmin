import React from 'react';
import { Portal, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

/*

Add this code to implemented snackbars

    const [openSnack, setOpenSnack] = useState({
        success: {
            state: false,
            message: "Message Success Default"
        },
        error: {
            state: false,
            message: "Message Error Default"
        },
        info: {
            state: false,
            message: "Message Info Default"
        }
    });

    const handleCloseSnack = useCallback(
        (reason, type) => {
            if (reason === "clickaway") {
            return;
            }
            setOpenSnack((state) => ({
            ...state,
            [type]: { ...state[type], state: false }
            }));
        },
        [setOpenSnack]
    );

    const handleOpenSnack = (type, message = null) => {
        setOpenSnack((state) => ({
            ...state,
            [type]: {
                ...state[type],
                state: true,
                message: message !== null ? message : state[type].message
            }
        }));
    };

//In render

    return(
        <SnackActions snack={openSnack} handleCloseSnack={handleCloseSnack} />
    )


How to Use:
    const type = "success" | "error" | "info"
    handleOpenSnack( type, "Message in snackbar" )

*/

const SnackActions = React.memo(({ snack, handleCloseSnack }) => {
    return (
        <Portal>
            <Snackbar
                open={snack.success.state}
                autoHideDuration={3000}
                onClose={(_, reason) => {
                    handleCloseSnack(reason, "success");
                }}
            >
                <Alert
                    onClose={(_, reason) => {
                        handleCloseSnack(reason, "success");
                    }}
                    severity="success"
                >
                    {snack.success.message}
                </Alert>
            </Snackbar>
            <Snackbar
                open={snack.error.state}
                autoHideDuration={3000}
                onClose={(_, reason) => {
                    handleCloseSnack(reason, "error");
                }}
            >
                <Alert
                    onClose={(_, reason) => {
                        handleCloseSnack(reason, "error");
                    }}
                    severity="error"
                >
                    {snack.error.message}
                </Alert>
            </Snackbar>
            <Snackbar
                open={snack.info.state}
                autoHideDuration={3000}
                onClose={(_, reason) => {
                    handleCloseSnack(reason, "info");
                }}
            >
                <Alert
                    onClose={(_, reason) => {
                        handleCloseSnack(reason, "info");
                    }}
                    severity="info"
                >
                    {snack.info.message}
                </Alert>
            </Snackbar>
        </Portal>
    )
});

export default SnackActions;
