import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import { storeFormSections } from "../../config/storeFormConfig";

import FormSection from "../../components/user/FormSection";
import InputField from "../../components/user/InputField";
import SelectField from "../../components/user/SelectField";
import RadioGroupField from "../../components/user/RadioGroupField";
import SuccessModal from "../../components/SuccessModal";

const CreateStore = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const username = Cookies.get("username");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = Cookies.get("token");

      await axios.post(
        `${BACKEND_URL}/api/store/create`,
        { ...formData, onboardedBy: username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setModalVisible(true);
      setFormData({});
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen w-full ">
      <SuccessModal
        visible={modalVisible}
        title="Store Created 🎉"
        onClose={() => setModalVisible(false)}
      />

      {/* MAIN CONTAINER */}
      <div className="w-full bg-white shadow-sm border border-gray-200 rounded-lg p-4">
        {/* HEADER */}
        <h2 className="text-lg font-semibold text-blue-900 mb-3">
          Create Store
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {storeFormSections.map((section) => (
            <FormSection key={section.title} title={section.title}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {section.fields.map((field) => {
                  if (field.showIf) {
                    if (formData[field.showIf.field] !== field.showIf.value) {
                      return null;
                    }
                  }

                  if (field.type === "input") {
                    return (
                      <InputField
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        type={field.typeInput || "text"}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        required={field.required}
                      />
                    );
                  }

                  if (field.type === "select") {
                    return (
                      <SelectField
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        options={field.options}
                        required={field.required}
                      />
                    );
                  }

                  if (field.type === "radio") {
                    return (
                      <RadioGroupField
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        options={field.options}
                      />
                    );
                  }

                  return null;
                })}
              </div>
            </FormSection>
          ))}

          {/* LEAD SECTION */}
          <FormSection title="Lead & Onboarding">
            <div className="grid md:grid-cols-2 gap-2">
              <InputField
                label="Lead Given By"
                name="leadGivenBy"
                value={formData.leadGivenBy || ""}
                onChange={handleChange}
              />

              <InputField label="Onboarded By" value={username} readOnly />
            </div>
          </FormSection>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-center pt-2">
            <button className="px-5 py-1.5 text-sm bg-blue-900 text-white rounded-md hover:bg-blue-800 transition">
              Create Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStore;
