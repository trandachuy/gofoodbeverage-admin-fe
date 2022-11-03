import React, { useEffect, useState } from "react";
import { Form, Input, Row, Col, message } from "antd";
import { TrashFill } from "constants/icons.constants";
import FnbSelectMaterialComponent from "components/fnb-select-material/fnb-select-material";
import { FnbTable } from "components/fnb-table/fnb-table";
import { FnbModal } from "components/fnb-modal/fnb-modal-component";
import { getValidationMessages } from "utils/helpers";
import { Thumbnail } from "components/thumbnail/thumbnail";

export default function EditMaterialCategoryComponent(props) {
  const { t, isEditMaterialCategory, onCancel, materialCategoryDataService, onCompleted } = props;
  const [form] = Form.useForm();
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [listMaterial, setListMaterial] = useState([]);
  const [materialCategoryId, setMaterialCategoryId] = useState();
  const [title, setTitle] = useState("");

  const pageData = {
    btnCancel: t("button.cancel"),
    btnUpdate: t("button.update"),
    leaveForm: t("messages.leaveForm"),
    updateMaterialCategorySuccess: t("messages.updateMaterialCategorySuccess"),
    materialCategory: {
      create: t("materialCategory.create"),
      nameCategory: t("materialCategory.nameCategory"),
      enterCategoryName: t("materialCategory.enterCategoryName"),
      pleaseEnterNameCategory: t("materialCategory.pleaseEnterNameCategory"),

      nameCategoryExisted: t("materialCategory.nameCategoryExisted"),
    },
    selectMaterial: {
      title: t("materialCategory.selectMaterial"),
      table: {
        name: t("table.name"),
        quantity: t("table.quantity"),
        unit: t("table.unit"),
        action: t("table.action"),
      },
    },
  };

  useEffect(() => {
    props.func.current = setInitData;
  }, []);

  const setInitData = (data) => {
    const { currentMaterialCategory } = data;
    setSelectedMaterials(data?.listMaterialCategoryMaterial);
    const listMaterial = data?.listMaterial.filter((b) => !data?.listMaterialCategoryMaterial.find((v) => v.id === b.id));
    setListMaterial(listMaterial);
    setMaterialCategoryId(currentMaterialCategory?.id);
    setTitle(currentMaterialCategory?.name);
    form.setFieldsValue({
      name: currentMaterialCategory?.name,
    });
  };

  const onSelectMaterial = (id) => {
    let selectedMaterial = listMaterial?.find((m) => m.id === id);
    let material = listMaterial.filter((m) => m.id !== id);
    setSelectedMaterials([...selectedMaterials, selectedMaterial]);
    setListMaterial(material);
  };

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      let materialIds = [];
      selectedMaterials.map((item) => {
        materialIds.push(item.id);
      });
      const updateCategoryRequest = {
        ...values,
        materialIds: materialIds,
        id: materialCategoryId,
      };

      materialCategoryDataService
        .updateMaterialCategoryByIdAsync(updateCategoryRequest)
        .then((res) => {
          if (res) {
            form.resetFields();
            message.success(pageData.updateMaterialCategorySuccess);
            onCompleted();
          }
        })
        .catch((errs) => {
          form.setFields(getValidationMessages(errs));
        });
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedMaterials([]);
    setListMaterial([]);
    onCancel();
  };

  const removeItemMaterial = (id) => {
    let itemMaterial = selectedMaterials.find((m) => m.id === id);
    let listSelectedMaterial = selectedMaterials.filter((m) => m.id !== id);
    setSelectedMaterials(listSelectedMaterial);
    setListMaterial([...listMaterial, itemMaterial]);
  };

  const columnsMaterial = () => {
    let columns = [
      {
        title: pageData.selectMaterial.table.name,
        dataIndex: "name",
        key: "name",
        width: "330px",
        render: (_, record) => (
          <>
            <Row className="table-img-box">
              <div>
                <Thumbnail src={record?.thumbnail} />
              </div>
              <div className="product-name text-line-clamp-1">
                <span className="selected-material-text"> {record?.name}</span>
              </div>
            </Row>
          </>
        ),
      },
      {
        title: pageData.selectMaterial.table.quantity,
        dataIndex: "quantity",
        key: "quantity",
        width: "150px",
        render: (_, record) => <span className="selected-material-text"> {record?.quantity ?? "-"}</span>,
      },
      {
        title: pageData.selectMaterial.table.unit,
        dataIndex: "unitName",
        key: "unitName",
        width: "150px",
        render: (_, record) => <span className="selected-material-text"> {record?.unitName ?? "-"}</span>,
      },
      {
        title: pageData.selectMaterial.table.action,
        key: "action",
        align: "center",
        render: (_, record) => (
          <>
            <a onClick={() => removeItemMaterial(record?.id)}>
              <TrashFill />
            </a>
          </>
        ),
      },
    ];
    return columns;
  };

  const renderContent = () => {
    return (
      <Form form={form} name="basic" onFinish={onFinish} autoComplete="off">
        <h4 className="fnb-form-label">
          {pageData.materialCategory.nameCategory}
          <span className="text-danger">*</span>
        </h4>
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: pageData.materialCategory.pleaseEnterNameCategory,
            },
          ]}
        >
          <Input className="fnb-input-with-count" showCount maxLength={100} placeholder={pageData.materialCategory.enterCategoryName} />
        </Form.Item>

        <h4 className="fnb-form-label pt-16">{pageData.selectMaterial.title}</h4>
        <Form.Item>
          <FnbSelectMaterialComponent t={t} materialList={listMaterial} onChangeEvent={(value) => onSelectMaterial(value)} />
        </Form.Item>

        {selectedMaterials.length > 0 && (
          <Row className="w-100">
            <Col span={24}>
              <FnbTable
                className="selected-material-table"
                dataSource={selectedMaterials}
                columns={columnsMaterial()}
                total={selectedMaterials.length}
                scrollY={100 * 5}
              />
            </Col>
          </Row>
        )}
      </Form>
    );
  };

  return (
    <FnbModal
      width={"800px"}
      title={title}
      visible={isEditMaterialCategory}
      handleCancel={handleCancel}
      cancelText={pageData.btnCancel}
      okText={pageData.btnUpdate}
      onOk={onFinish}
      content={renderContent()}
    ></FnbModal>
  );
}
