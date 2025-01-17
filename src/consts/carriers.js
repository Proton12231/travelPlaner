export const TRANSPORT_TYPES = [
  { value: "flight", label: "飞机" },
  { value: "train", label: "火车" },
  { value: "bus", label: "汽车" },
];

export const TRANSIT_TYPES = [
  { value: "direct", label: "直飞/直达" },
  { value: "transit", label: "中转" },
  { value: "stopover", label: "经停" },
];

export const CARRIERS = {
  flight: [
    { value: "CZ", label: "南方航空", code: "CZ" },
    { value: "MU", label: "东方航空", code: "MU" },
    { value: "CA", label: "中国国航", code: "CA" },
    { value: "HU", label: "海南航空", code: "HU" },
    { value: "3U", label: "四川航空", code: "3U" },
    { value: "MF", label: "厦门航空", code: "MF" },
    { value: "ZH", label: "深圳航空", code: "ZH" },
    { value: "SC", label: "山东航空", code: "SC" },
    { value: "GJ", label: "吉祥航空", code: "GJ" },
    { value: "KY", label: "昆明航空", code: "KY" },
  ],
  train: [
    { value: "G", label: "高铁", code: "G" },
    { value: "D", label: "动车", code: "D" },
    { value: "C", label: "城际", code: "C" },
    { value: "Z", label: "直达", code: "Z" },
    { value: "T", label: "特快", code: "T" },
    { value: "K", label: "快速", code: "K" },
  ],
  bus: [{ value: "LY", label: "陆运快车" }],
};
