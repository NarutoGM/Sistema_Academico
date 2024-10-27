import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, Select, Table, message } from 'antd';
import { getEscuelas, createEscuela, updateEscuela, deleteEscuela } from '@/pages/services/escuela.services';
import { getFacultades } from '@/pages/services/escuela.services'; // Asegúrate de tener un servicio para obtener facultades

const { Option } = Select;

const Escuelas = () => {
  const [escuelas, setEscuelas] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEscuela, setCurrentEscuela] = useState(null);
  const [form] = Form.useForm();

  // Cargar escuelas y facultades
  useEffect(() => {
    fetchEscuelas();
    fetchFacultades();
  }, []);

  const fetchEscuelas = async () => {
    try {
      const data = await getEscuelas();
      setEscuelas(data);
    } catch (error) {
      message.error('Error al cargar las escuelas');
    }
  };

  const fetchFacultades = async () => {
    try {
      const data = await getFacultades(); // Asume que existe este servicio
      setFacultades(data);
    } catch (error) {
      message.error('Error al cargar las facultades');
    }
  };

  const handleCreate = () => {
    setCurrentEscuela(null);
    setIsEditing(false);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (escuela: any) => {
    setCurrentEscuela(escuela);
    setIsEditing(true);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: escuela.name,
      idFacultad: escuela.idFacultad,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEscuela(id);
      message.success('Escuela eliminada exitosamente');
      fetchEscuelas();
    } catch (error) {
      message.error('Error al eliminar la escuela');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentEscuela(null);
    form.resetFields();
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isEditing && currentEscuela) {
        await updateEscuela(currentEscuela.idEscuela, values);
        message.success('Escuela actualizada exitosamente');
      } else {
        await createEscuela(values);
        message.success('Escuela creada exitosamente');
      }

      fetchEscuelas();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Error al guardar la escuela');
    }
  };

  const columns = [
    {
      title: 'Nombre de la Escuela',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Facultad',
      dataIndex: 'facultad',
      key: 'facultad',
      render: (facultad: any) => facultad?.name || 'Sin facultad',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: any) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.idEscuela)}>
            Eliminar
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleCreate}>
        Crear Escuela
      </Button>
      <Table
        dataSource={escuelas}
        columns={columns}
        rowKey="idEscuela"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={isEditing ? 'Editar Escuela' : 'Crear Escuela'}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleFormSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre de la Escuela"
            rules={[{ required: true, message: 'Por favor ingrese el nombre de la escuela' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="idFacultad"
            label="Facultad"
            rules={[{ required: true, message: 'Por favor seleccione una facultad' }]}
          >
            <Select placeholder="Seleccione una facultad">
              {facultades.map((facultad: any) => (
                <Option key={facultad.idFacultad} value={facultad.idFacultad}>
                  {facultad.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Escuelas;
