import { Button, Input, Modal, Select } from "antd";

const { Option } = Select;
const ReturnEstimationFields = ({
  filterOpen,
  setFilterOpen,
  handleOk,
  handleCancel,
  partyRef,
  selectedParty,
  setSelectedParty,
  handlePartyChange,
  handleKeyDown,
  touchRef,
  wastRef,
  tagNoRef,
  touchValue,
  wastageValue,
  setTouchValue,
  setWastageValue,
  partyNames,
  tableData,
  setTableData,
  setTotalFineGold,
}) => {
  return (
    <div>
      <Modal
        title="Estimation Details"
        open={filterOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flex: "1 1 200px",
            marginBottom: "8px",
          }}
        >
          <div>Party Name:</div>
          <Select
            showSearch
            placeholder="Select Party Name"
            autoFocus={true}
            style={{ width: "70%" }}
            ref={partyRef}
            value={selectedParty || null}
            onChange={(value) => {
              setSelectedParty(value);
              handlePartyChange();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const filteredOptions = partyNames.filter((party) =>
                  party.Dealername.toLowerCase().includes(
                    e.target.value.toLowerCase()
                  )
                );
                if (filteredOptions.length > 0) {
                  setSelectedParty(filteredOptions[0].Dealername);
                }
              }
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {partyNames.map((party, index) => (
              <Option key={index} value={party.Dealername}>
                {party.Dealername}
              </Option>
            ))}
          </Select>
        </div>

        {/* Touch & Wast Inputs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flex: "1 1 200px",
          }}
        >
          <div>Touch:</div>
          <Input
            placeholder="Enter Touch"
            ref={touchRef}
            style={{ width: "100px", height: 30 }}
            onKeyDown={(e) => handleKeyDown(e, wastRef)}
            value={touchValue}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 2) {
                setTouchValue(value);
              }
            }}
          />
          <div>Wast:</div>
          <Input
            placeholder="Enter Wast"
            ref={wastRef}
            style={{ width: "100px", height: 30 }}
            onKeyDown={(e) => handleKeyDown(e, tagNoRef)}
            value={wastageValue}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 2) {
                setWastageValue(value);
              }
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "5px",
            flex: "1 1 200px",
          }}
        >
          <Button
            type="primary"
            disabled={touchValue && wastageValue ? false : true}
            style={{
              width: "100px",
              height: "60px",
              textAlign: "center",
              lineHeight: "1.2",
              padding: "8px",
              whiteSpace: "normal",
              background: "#7D8D86",
            }}
            onClick={() => {
              const touch = Number(touchValue) || 0;
              const wastage = Number(wastageValue) || 0;
              const updatedTOCH = touch + wastage;

              const updatedTableData = tableData.map((row) => {
                const finalGold = (Number(row?.NWT) * updatedTOCH) / 100;
                const actPer = (Number(finalGold) / Number(row?.GWT)) * 100;
                return {
                  ...row,
                  TOUCH: updatedTOCH,
                  FINALGOLD: finalGold?.toFixed(3),
                  ACTPER: actPer?.toFixed(3),
                };
              });

              const totalGold = updatedTableData.reduce(
                (sum, item) => sum + Number(item.FINALGOLD || 0),
                0
              );

              setTableData(updatedTableData);
              setTotalFineGold(totalGold);
            }}
          >
            Wastage Change
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ReturnEstimationFields;
