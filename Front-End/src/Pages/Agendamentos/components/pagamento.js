import React, { useState, useEffect } from 'react';
import api from '../../../Utils/api';
import { Col, Divider, Row, Typography, Table, Button, Input, Modal, Select, message } from 'antd';

export default function PagarAgendamento({ agendamento, fecharModal }) {
   return (
      <h1>Pagar Agendamento - {agendamento} </h1>
   )
}