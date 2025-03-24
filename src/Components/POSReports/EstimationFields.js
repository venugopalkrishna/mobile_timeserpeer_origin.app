import { Input, Modal, Select } from "antd";

const { Option } = Select;
const EstimationFields = ({
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
      </Modal>
    </div>
  );
};

export default EstimationFields;
