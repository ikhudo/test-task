import { useCallback, useState } from "react";
import styled from "styled-components";
import { ChartData } from "./common/dto";
import LiveChart from "./components/chart/live-chart";
import Widget from "./components/widget";
import { ALERT_VARIANT, useAlertMessages } from "./services/alert-messages";
import { useSocket } from "./services/socket";

function App() {
  const [data, setData] = useState<ChartData>([]);
  const { createAlert } = useAlertMessages();

  const onMessage = useCallback(({ data }: MessageEvent) => {
    setData(JSON.parse(data));
  }, []);

  const onError = useCallback(
    (e: Event) => {
      createAlert(ALERT_VARIANT.error, "Error connecting to websocket server");
    },
    [createAlert]
  );

  const onClose = useCallback(() => {
    createAlert(ALERT_VARIANT.error, "Error connecting to websocket server");
  }, [createAlert]);

  const onOpen = useCallback(() => {
    createAlert(ALERT_VARIANT.success, "Connected to server");
  }, [createAlert]);

  useSocket({
    url: "ws://localhost:8999",
    onMessage,
    onError,
    onOpen,
    onClose,
  });

  return (
    <AppWrapper>
      <Page>
        <Header>
          <HeaderContent>
            <PageTitle>WILIOT</PageTitle>
            <Subtitle>Test</Subtitle>
          </HeaderContent>
        </Header>
        <Widgets>
          {data?.length &&
            data.map((dataSet) => (
              <Widget
                title={`ID ${dataSet.id}`}
                valueLabel="Temp:"
                value={dataSet.temperature}
                unit="C"
              />
            ))}
        </Widgets>
        <ChartWrapper>
          <LiveChart
            title="DATA"
            data={data}
            yField="data"
            xField="timestamp"
            preserveDataTime={300000}
          />
        </ChartWrapper>
      </Page>
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Header = styled.div`
  border-bottom: 1px solid #999;
  margin-bottom: 2rem;
`;
const HeaderContent = styled.div`
  display: flex;
  justify-content: right;
  align-items: flex-end;
  flex-direction: column;
  padding: 1rem;
`;
const PageTitle = styled.div`
  font-size: 2rem;
`;
const Subtitle = styled.div``;

const Page = styled.div`
  width: 60rem;
`;

const Widgets = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2em;
`;
const ChartWrapper = styled.div`
  border: 1px solid #999;
`;

export default App;
