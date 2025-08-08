import {Modal, Select } from "antd";

const { Option } = Select;

const ReturnEstimationSummaryDialog = ({
  filterOpen,
  setFilterOpen,
  selectedParty,
  setSelectedParty,
  partyNames,
}) => {
  const handleCancel = () => {
    setFilterOpen(false);
  };
  const handleOk = () => {
    setFilterOpen(false);
  };
  return (
    <Modal
      title="Estimation Summary Filters"
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
          style={{ width: "60%" }}
          value={selectedParty ? selectedParty : null}
          onChange={(value) => {
            setSelectedParty(value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const filteredOptions = partyNames.filter((party) =>
                party.DESCRIPTION.toLowerCase().includes(
                  e.target.value.toLowerCase()
                )
              );
              if (filteredOptions.length > 0) {
                setSelectedParty(filteredOptions[0].DESCRIPTION);
              }
            }
          }}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {partyNames.map((party, index) => (
            <Option key={index} value={party.DESCRIPTION}>
              {party.DESCRIPTION}
            </Option>
          ))}
        </Select>
      </div>
    </Modal>
  );
};

export default ReturnEstimationSummaryDialog;
