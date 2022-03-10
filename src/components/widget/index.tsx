import styled from "styled-components";

type WidgetProps = {
  title: string;
  valueLabel: string;
  value: number;
  unit?: string;
};

function Widget({ title, value, valueLabel, unit }: WidgetProps) {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Value>
        <Label>{valueLabel}</Label>
        {value}
        <Unit>{unit}</Unit>
      </Value>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid #999;
  flex: 1;
  max-width: 45%;
`;

const Title = styled.div`
  font-size: 1.5rem;
`;
const Value = styled.div`
  display: flex;
`;
const Label = styled.div`
  margin-right: 0.3rem;
`;
const Unit = styled.div`
  margin-left: 0.3rem;
`;

export default Widget;
