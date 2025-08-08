import { Input, Modal, Select } from "antd";

const { Option } = Select;

const TagDetailsDialog = ({
  filterOpen,
  setFilterOpen,
  selectedParty,
  setSelectedParty,
  partyNames,
  selectedItem,
  setSelectedItem,
  itemNames,
  searchTagNo,
  setSearchTagNo,
  searchEstimationNo,
  setSearchEstimationNO,
}) => {
  const handleCancel = () => {
    setFilterOpen(false);
  };
  const handleOk = () => {
    setFilterOpen(false);
  };
  return (
    <Modal
      title="Estimation Details Filters"
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
        <div>Product Name:</div>
        <Select
          showSearch
          allowClear
          placeholder="Select Product Name"
          autoFocus={true}
          style={{ width: "60%" }}
          value={selectedParty ? selectedParty : null}
          onChange={(value) => {
            setSelectedParty(value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const filteredOptions = partyNames.filter((party) =>
                party.PRODNAME.toLowerCase().includes(
                  e.target.value.toLowerCase()
                )
              );
              if (filteredOptions.length > 0) {
                setSelectedParty(filteredOptions[0].PRODNAME);
              }
            }
          }}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {partyNames.map((party, index) => (
            <Option key={index} value={party.PRODNAME}>
              {party.PRODNAME}
            </Option>
          ))}
        </Select>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flex: "1 1 200px",
          marginBottom: "8px",
        }}
      >
        <div>Worker Name:</div>
        <Select
          showSearch
          allowClear
          placeholder="Select Worker Name"
          autoFocus={true}
          style={{ width: "60%" }}
          value={selectedItem ? selectedItem : null}
          onChange={(value) => {
            setSelectedItem(value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const filteredOptions = itemNames.filter((party) =>
                party.workername.toLowerCase().includes(
                  e.target.value.toLowerCase()
                )
              );
              if (filteredOptions.length > 0) {
                setSelectedItem(filteredOptions[0].workername);
              }
            }
          }}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {itemNames.map((party, index) => (
            <Option key={index} value={party.workername}>
              {party.workername}
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
          marginBottom: "8px"
        }}
      >
        <div>Slip No:</div>
        <Input
          placeholder="Enter Slip No"
          style={{ width: "60%", height: 30 }}
          //   onKeyDown={(e) => handleKeyDown(e, estRef)}
          value={searchTagNo}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 8) {
              setSearchTagNo(value);
            }
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flex: "1 1 200px",
        }}
      >
        <div>Lost No:</div>
        <Input
          placeholder="Enter Lot No"
          style={{ width: "60%", height: 30 }}
          value={searchEstimationNo}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 8) {
              setSearchEstimationNO(value);
            }
          }}
        />
      </div>
    </Modal>
  );
};

export default TagDetailsDialog;
