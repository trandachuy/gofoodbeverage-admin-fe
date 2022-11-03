import { Button, Card, Checkbox, Col, Form, message, Row, Space, Typography } from "antd";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { StampType } from "constants/stamp-type.constants";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StampTemplateComponent } from "./components/stamp-template.component";
import "./index.scss";

const { Text } = Typography;

export default function StampConfig(props) {
  const { t, stampDataService } = props;

  const pageData = {
    stamp: t("stamp.stamp"),
    stampType: t("stamp.stampType"),
    showLogo: t("stamp.showLogo"),
    showTime: t("stamp.showTime"),
    showNumberOfItem: t("stamp.showNumberOfItem"),
    showItemNote: t("stamp.showItemNote"),
    isUpdatedSuccessfully: t("messages.isUpdatedSuccessfully"),
    save: t("button.save"),
    btnPrintPreview: t("button.printPreview"),
  };

  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [stampTypeList, setStampTypeList] = useState([]);
  const stampReviewRef = React.useRef(null);
  const [stampConfig, setStampConfig] = useState({});
  const [stampData, setStampData] = useState({});
  const storeLogoUrl = useSelector((state) => state?.session?.storeLogo);

  useEffect(() => {
    getInitialData();
  }, []);

  const createStampMockupData = () => {
    const stampData = {
      code: "#I1003",
      logo: storeLogoUrl,
      createdTime: "2022-07-06 10:03:41.6983432",
      itemList: [
        {
          no: "1",
          name: "Coffee",
          note: "This is note",
          options: [
            {
              name: "Sugar",
              value: "30%",
            },
            {
              name: "Ice",
              value: "50%",
            },
            {
              name: "Pudding",
              value: "x122",
            },
          ],
          current: true,
        },
        {
          no: "2",
          name: "Milk tea",
          note: "This is note",
          options: [
            {
              name: "Sugar",
              value: "30%",
            },
          ],
          current: false,
        },
      ],
    };

    return stampData;
  };

  const getInitialData = async () => {
    const stampData = createStampMockupData();
    setStampData(stampData);
    let res = await stampDataService.getStampConfigByStoreIdAsync();
    if (res) {
      setStampTypeList(res.stampTypeList);
      let formValue = undefined;
      if (res.stampConfig !== undefined) {
        let data = res?.stampConfig;
        formValue = {
          stampType: data.stampType,
          isShowLogo: data.isShowLogo,
          isShowTime: data.isShowTime,
          isShowNumberOfItem: data?.isShowNumberOfItem,
          isShowNote: data.isShowNote,
        };

        setStampConfig(formValue);
        form.setFieldsValue(formValue);
      } else {
        formValue = {
          stampType: StampType.mm50x30,
          isShowLogo: true,
          isShowTime: true,
          isShowNumberOfItem: true,
          isShowNote: true,
        };

        setStampConfig(formValue);
        form.setFieldsValue(formValue);
      }
      stampData.logo = storeLogoUrl;

      if (stampReviewRef && stampReviewRef.current) {
        stampReviewRef.current.render(formValue, stampData);
      }
    }
  };

  const onStampTypeChange = (value) => {
    setStampConfig({ ...stampConfig, stampType: value });
  };

  const onChangeStampConfig = () => {
    if (!isChangeForm) setIsChangeForm(true);

    const newStampConfig = form.getFieldsValue();
    setStampConfig({ ...stampConfig, ...newStampConfig });
    if (stampReviewRef && stampReviewRef.current) {
      stampReviewRef.current.render(newStampConfig, stampData);
    }
  };

  const onFinish = () => {
    form.validateFields().then((values) => {
      stampDataService.updateStampConfigByStoreIdAsync(values).then((res) => {
        if (res) {
          message.success(`${pageData.stamp} ${pageData.isUpdatedSuccessfully}`);
        }
      });
    });
  };

  const printTemplate = () => {
    if (stampReviewRef && stampReviewRef.current) {
      stampReviewRef.current.print();
    }
  };

  return (
    <>
      <Card
        className="stamp-card"
        title="Stamp"
        extra={
          <Space className="float-right">
            <Button htmlType="button" className="action-review" type="primary" onClick={printTemplate}>
              {pageData.btnPrintPreview}
            </Button>
            <Button onClick={() => onFinish()} type="primary">
              {pageData.save}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          name="basic"
          onFieldsChange={() => {
            onChangeStampConfig();
          }}
          autoComplete="off"
          gutter={12}
          className="stamp-form"
        >
          <Row>
            <Col span={16} className="border-div">
              <h3>{pageData.stampType}</h3>
              <Form.Item name="stampType">
                <FnbSelectSingle
                  className="item-input"
                  option={stampTypeList?.map((item) => ({
                    id: item.id,
                    name: item.name,
                  }))}
                  onChange={onStampTypeChange}
                  showSearch
                />
              </Form.Item>
              <Form.Item name="isShowLogo" valuePropName="checked">
                <Checkbox>
                  <Text>{pageData.showLogo}</Text>
                </Checkbox>
              </Form.Item>
              <Form.Item name="isShowTime" valuePropName="checked">
                <Checkbox>
                  <Text>{pageData.showTime} (HH:MM)</Text>
                </Checkbox>
              </Form.Item>
              <Form.Item name="isShowNumberOfItem" valuePropName="checked">
                <Checkbox>
                  <Text>{pageData.showNumberOfItem}</Text>
                </Checkbox>
              </Form.Item>
              <Form.Item name="isShowNote" valuePropName="checked">
                <Checkbox>
                  <Text>{pageData.showItemNote}</Text>
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={8} className="div-vertically">
              <StampTemplateComponent ref={stampReviewRef} />
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}
