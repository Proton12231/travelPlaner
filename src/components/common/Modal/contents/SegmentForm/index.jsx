import { useState, useEffect } from "react";
import { Modal } from "../../index";
import { Input } from "../../../Input";
import { Select } from "../../../Select";
import { Cascader } from "../../../Cascader";
import { DateTimePicker } from "../../../DateTimePicker";
import { Button } from "../../../Button";
import {
  TRANSPORT_TYPES,
  CARRIERS,
  TRANSIT_TYPES,
} from "../../../../../consts/carriers";
import { CITY_OPTIONS } from "../../../../../consts/cities";
import styles from "./SegmentForm.module.scss";
import PropTypes from "prop-types";

export const SegmentForm = ({ data, onSave, onCancel }) => {
  const [form, setForm] = useState({
    type: "flight",
    from: "",
    fromLabel: "",
    to: "",
    toLabel: "",
    departureTime: "",
    arrivalTime: "",
    carrier: "",
    flightNo: "",
    trainNo: "",
    price: "",
    transitType: "direct",
    transitCity: "",
    transitCityLabel: "",
    transitArrivalTime: "",
    transitDepartureTime: "",
    transitDuration: "",
    needAccommodation: false,
    hotel: "",
    hotelPrice: "",
    ...data,
  });

  useEffect(() => {
    if (data) {
      const processedData = {
        ...data,
        from: data.fromLabel ? data.fromLabel.split(" / ")[0] : data.from,
        to: data.toLabel ? data.toLabel.split(" / ")[0] : data.to,
        transitCity: data.transitCityLabel
          ? data.transitCityLabel.split(" / ")[0]
          : data.transitCity,
      };
      setForm(processedData);
    }
  }, [data]);

  const handleCityChange = (type) => (value, selectedOptions) => {
    const cityLabel = selectedOptions.map((option) => option.label).join(" / ");
    setForm({
      ...form,
      [type]: value,
      [`${type}Label`]: cityLabel,
    });
  };

  const getNumberInputLabel = () => {
    if (form.type === "bus") return null;
    return form.type === "flight" ? "航班号" : "车次号";
  };

  const getCarrierOptions = () => {
    return CARRIERS[form.type] || [];
  };

  const getNumberInputPrefix = () => {
    if (form.type === "bus") return null;
    const carriers = getCarrierOptions();
    const selectedCarrier = carriers.find((c) => c.value === form.carrier);
    return selectedCarrier?.code || "";
  };

  const handleNumberChange = (e) => {
    const value = e.target.value.toUpperCase();
    const fieldName = form.type === "flight" ? "flightNo" : "trainNo";
    setForm({
      ...form,
      [fieldName]: value,
    });
  };

  const renderTransportNumber = () => {
    if (form.type === "bus") return null;

    const prefix = getNumberInputPrefix();
    const label = getNumberInputLabel();
    const value = form.type === "flight" ? form.flightNo : form.trainNo;

    return (
      <Input
        label={label}
        value={value}
        onChange={handleNumberChange}
        prefix={prefix}
        placeholder={`请输入${label}`}
      />
    );
  };

  const calculateTransitDuration = () => {
    if (!form.transitArrivalTime || !form.transitDepartureTime) return "";
    const arrival = new Date(form.transitArrivalTime);
    const departure = new Date(form.transitDepartureTime);
    const duration = departure - arrival;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}小时${minutes}分钟`;
  };

  const renderTransitFields = () => {
    if (form.transitType === "direct") return null;

    return (
      <>
        <Cascader
          label={`${form.transitType === "transit" ? "中转" : "经停"}城市`}
          value={form.transitCity}
          options={CITY_OPTIONS}
          onChange={(value, selectedOptions) => {
            const cityLabel = selectedOptions
              .map((option) => option.label)
              .join(" / ");
            setForm({
              ...form,
              transitCity: value,
              transitCityLabel: cityLabel,
            });
          }}
          placeholder={`请选择${
            form.transitType === "transit" ? "中转" : "经停"
          }城市`}
        />
        <div className={styles.row}>
          <DateTimePicker
            label={`到达${
              form.transitType === "transit" ? "中转" : "经停"
            }城市时间`}
            value={form.transitArrivalTime}
            onChange={(value) => {
              setForm({
                ...form,
                transitArrivalTime: value,
                transitDuration: calculateTransitDuration(),
              });
            }}
            placeholder="请选择到达时间"
          />
          <DateTimePicker
            label={`离开${
              form.transitType === "transit" ? "中转" : "经停"
            }城市时间`}
            value={form.transitDepartureTime}
            onChange={(value) => {
              setForm({
                ...form,
                transitDepartureTime: value,
                transitDuration: calculateTransitDuration(),
              });
            }}
            placeholder="请选择离开时间"
          />
        </div>
        {form.transitDuration && (
          <div className={styles.transitDuration}>
            {form.transitType === "transit" ? "中转" : "经停"}等待时间：
            {form.transitDuration}
          </div>
        )}
      </>
    );
  };

  const renderAccommodationFields = () => {
    if (!form.needAccommodation) return null;

    return (
      <div className={styles.row}>
        <Input
          label="酒店名称"
          value={form.hotel}
          onChange={(e) => setForm({ ...form, hotel: e.target.value })}
          placeholder="请输入酒店名称"
        />
        <Input
          label="住宿费用"
          type="number"
          value={form.hotelPrice}
          onChange={(e) => setForm({ ...form, hotelPrice: e.target.value })}
          prefix="¥"
          placeholder="请输入住宿费用"
        />
      </div>
    );
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={data.index !== undefined ? "编辑行程" : "添加行程"}
      width="600px"
    >
      <div className={styles.form}>
        <Select
          label="出行方式"
          value={form.type}
          options={TRANSPORT_TYPES}
          onChange={(value) => {
            setForm({
              ...form,
              type: value,
              carrier: "",
              flightNo: "",
              trainNo: "",
            });
          }}
        />

        <div className={styles.row}>
          <Cascader
            label="出发城市"
            value={form.from}
            options={CITY_OPTIONS}
            onChange={handleCityChange("from")}
            placeholder="请选择出发城市"
          />
          <Cascader
            label="到达城市"
            value={form.to}
            options={CITY_OPTIONS}
            onChange={handleCityChange("to")}
            placeholder="请选择到达城市"
          />
        </div>

        <div className={styles.row}>
          <DateTimePicker
            label="出发时间"
            value={form.departureTime}
            onChange={(value) => setForm({ ...form, departureTime: value })}
            placeholder="请选择出发时间"
          />
          <DateTimePicker
            label="到达时间"
            value={form.arrivalTime}
            onChange={(value) => setForm({ ...form, arrivalTime: value })}
            placeholder="请选择到达时间"
          />
        </div>

        <Select
          label="承运商"
          value={form.carrier}
          options={getCarrierOptions()}
          onChange={(value) => {
            setForm({
              ...form,
              carrier: value,
              flightNo: "",
              trainNo: "",
            });
          }}
          placeholder="请选择承运商"
        />

        {renderTransportNumber()}

        <Input
          label="费用"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          prefix="¥"
          placeholder="请输入费用"
        />

        <Select
          label={`${form.type === "flight" ? "航班" : "行程"}类型`}
          value={form.transitType}
          options={TRANSIT_TYPES}
          onChange={(value) => {
            setForm({
              ...form,
              transitType: value,
              transitCity: "",
              transitCityLabel: "",
              transitArrivalTime: "",
              transitDepartureTime: "",
              transitDuration: "",
            });
          }}
          placeholder="请选择类型"
        />

        {form.transitType !== "direct" && (
          <>
            <Cascader
              label={`${form.transitType === "transit" ? "中转" : "经停"}城市`}
              value={form.transitCity}
              options={CITY_OPTIONS}
              onChange={(value, selectedOptions) => {
                const cityLabel = selectedOptions
                  .map((option) => option.label)
                  .join(" / ");
                setForm({
                  ...form,
                  transitCity: value,
                  transitCityLabel: cityLabel,
                });
              }}
              placeholder={`请选择${
                form.transitType === "transit" ? "中转" : "经停"
              }城市`}
            />

            <div className={styles.row}>
              <DateTimePicker
                label={`到达${
                  form.transitType === "transit" ? "中转" : "经停"
                }城市时间`}
                value={form.transitArrivalTime}
                onChange={(value) => {
                  setForm({
                    ...form,
                    transitArrivalTime: value,
                    transitDuration: calculateTransitDuration(),
                  });
                }}
                placeholder="请选择到达时间"
              />
              <DateTimePicker
                label={`离开${
                  form.transitType === "transit" ? "中转" : "经停"
                }城市时间`}
                value={form.transitDepartureTime}
                onChange={(value) => {
                  setForm({
                    ...form,
                    transitDepartureTime: value,
                    transitDuration: calculateTransitDuration(),
                  });
                }}
                placeholder="请选择离开时间"
              />
            </div>
          </>
        )}

        <div className={styles.checkbox}>
          <input
            type="checkbox"
            id="needAccommodation"
            checked={form.needAccommodation}
            onChange={(e) =>
              setForm({
                ...form,
                needAccommodation: e.target.checked,
                hotel: e.target.checked ? form.hotel : "",
                hotelPrice: e.target.checked ? form.hotelPrice : "",
              })
            }
          />
          <label htmlFor="needAccommodation">需要过夜住宿</label>
        </div>

        {renderAccommodationFields()}

        <div className={styles.footer}>
          <Button variant="text" onClick={onCancel}>
            取消
          </Button>
          <Button variant="primary" onClick={() => onSave(form)}>
            保存
          </Button>
        </div>
      </div>
    </Modal>
  );
};

SegmentForm.propTypes = {
  data: PropTypes.shape({
    index: PropTypes.number,
    type: PropTypes.string,
    from: PropTypes.string,
    fromLabel: PropTypes.string,
    to: PropTypes.string,
    toLabel: PropTypes.string,
    departureTime: PropTypes.string,
    arrivalTime: PropTypes.string,
    carrier: PropTypes.string,
    flightNo: PropTypes.string,
    trainNo: PropTypes.string,
    price: PropTypes.string,
    transitType: PropTypes.string,
    transitCity: PropTypes.string,
    transitCityLabel: PropTypes.string,
    transitArrivalTime: PropTypes.string,
    transitDepartureTime: PropTypes.string,
    transitDuration: PropTypes.string,
    hotel: PropTypes.string,
    hotelPrice: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
