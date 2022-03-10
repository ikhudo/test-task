import CloseIcon from "@mui/icons-material/Close";
import {
  OptionsObject,
  SnackbarKey,
  SnackbarProvider,
  useSnackbar,
} from "notistack";
import { createRef, ReactNode, useCallback } from "react";
import styled from "styled-components";

export enum ALERT_VARIANT {
  default = "default",
  error = "error",
  success = "success",
  warning = "warning",
  info = "info",
}

export const useAlertMessages = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const createAlert = useCallback(
    (variant: ALERT_VARIANT, message?: string, options?: OptionsObject) => {
      const alertMessage = message;

      if (!alertMessage) {
        throw new Error("The message should be defined");
      }

      const alertId = enqueueSnackbar(alertMessage, { variant, ...options });
      return alertId;
    },
    [enqueueSnackbar]
  );

  const removeAlert = useCallback(
    (id: number) => {
      closeSnackbar(id);
    },
    [closeSnackbar]
  );

  const cleanAllAlerts = useCallback(() => {
    closeSnackbar();
  }, [closeSnackbar]);

  return {
    createAlert,
    removeAlert,
    cleanAllAlerts,
  };
};

const MAX_ALERTS_AT_TIME = 5;
const AUTO_HIDE_TIMEOUT = 5000;

const AlertMessagesProvider = ({ children }: { children: ReactNode }) => {
  const snackbarProviderRef = createRef<SnackbarProvider>();

  const onClickDismiss = (key: SnackbarKey) => () => {
    snackbarProviderRef?.current?.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      ref={snackbarProviderRef}
      maxSnack={MAX_ALERTS_AT_TIME}
      action={(key) => <StyledCloseIcon onClick={onClickDismiss(key)} />}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      autoHideDuration={AUTO_HIDE_TIMEOUT}
    >
      {children}
    </SnackbarProvider>
  );
};

const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
  margin-right: 0.5rem;
`;

export default AlertMessagesProvider;
