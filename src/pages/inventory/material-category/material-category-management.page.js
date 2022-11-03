import React, { useState } from "react";
import TableMaterialCategoryComponent from "./components/table-material-category.component";
import FormNewMaterialCategoryComponent from "./components/form-new-material-category.component";
import EditMaterialCategoryComponent from "./components/edit-material-category.component";
import { useTranslation } from "react-i18next";
import materialDataService from "data-services/material/material-data.service";
import materialCategoryDataService from "data-services/material-category/material-category-data.service";

export default function MaterialCategoryManagement(props) {
  const [t] = useTranslation();
  const [showAddNewCategoryForm, setShowAddNewCategoryForm] = useState(false);
  const tableFuncs = React.useRef(null);
  const editComponentRef = React.useRef(null);
  const addComponentRef = React.useRef(null);
  const [isEditMaterialCategory, setIsEditMaterialCategory] = useState(false);
  const [dataMaterialCategory, setDataMaterialCategory] = useState(null);

  const onClickAddNew = () => {
    materialDataService.getAllMaterialManagementsAsync().then((res) => {
      if (res) {
        addComponentRef.current({
          listMaterial: res.materials,
        });
        setShowAddNewCategoryForm(true);
      }
    });
  };

  const onCompletedAddForm = () => {
    setShowAddNewCategoryForm(false);
    tableFuncs.current();
  };

  const onCompletedEditForm = () => {
    setIsEditMaterialCategory(false);
    tableFuncs.current();
  };

  const onEditMaterialCategory = async (id) => {
    let promises = [];
    promises.push(materialCategoryDataService.getMaterialCategoryByIdAsync(id));
    promises.push(materialDataService.getAllMaterialManagementsAsync());
    let [dataMaterialCategory, dataMaterials] = await Promise.all(promises);

    let listMaterialCategoryMaterial = dataMaterialCategory.materialCategory.materials;

    editComponentRef.current({
      currentMaterialCategory: dataMaterialCategory?.materialCategory,
      listMaterialCategoryMaterial: listMaterialCategoryMaterial,
      listMaterial: dataMaterials.materials,
    });

    setIsEditMaterialCategory(true);
  };

  return (
    <>
      <FormNewMaterialCategoryComponent
        t={t}
        materialDataService={materialDataService}
        materialCategoryDataService={materialCategoryDataService}
        showAddNewCategoryForm={showAddNewCategoryForm}
        onCancel={() => setShowAddNewCategoryForm(false)}
        onCompleted={() => onCompletedAddForm()}
        func={addComponentRef}
      />

      <EditMaterialCategoryComponent
        dataMaterialCategory={dataMaterialCategory}
        t={t}
        materialDataService={materialDataService}
        materialCategoryDataService={materialCategoryDataService}
        isEditMaterialCategory={isEditMaterialCategory}
        onCancel={() => setIsEditMaterialCategory(false)}
        onCompleted={() => onCompletedEditForm()}
        func={editComponentRef}
      />

      <TableMaterialCategoryComponent
        onShowNewCategoryManagementComponent={onClickAddNew}
        tableFuncs={tableFuncs}
        onEditMaterialCategory={onEditMaterialCategory}
      />
    </>
  );
}
