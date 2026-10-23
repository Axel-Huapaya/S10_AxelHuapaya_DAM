import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
} from 'react-native';

import { AppInput } from '../components/common/app-input';
import { AppButton } from '../components/common/app-button';
import { colors } from '../constants/colors';
import { theme } from '../constants/theme';
import {
  validarNombre,
  validarCorreo,
  validarEdad,
  validarEntrada,
} from '../utils/validators';

const TIPOS_ENTRADA = [
  { id: 'general', titulo: 'General', precio: 'Gratis', desc: 'Acceso a conferencias principales' },
  { id: 'estudiante', titulo: 'Estudiante', precio: '$15.00', desc: 'Incluye talleres y certificado' },
  { id: 'vip', titulo: 'VIP Pass', precio: '$45.00', desc: 'Networking exclusivo y asientos preferenciales' },
];

export default function InscripcionEventoScreen() {
  // Estados de los campos del formulario
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [edad, setEdad] = useState('');
  const [entrada, setEntrada] = useState('');

  // Estados de control de errores y éxito
  const [haIntentadoEnviar, setHaIntentadoEnviar] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [datosConfirmados, setDatosConfirmados] = useState<{
    nombre: string;
    correo: string;
    edad: string;
    entrada: string;
    ticketCode: string;
  } | null>(null);

  // Validaciones en tiempo real
  const nombreValido = validarNombre(nombre);
  const correoValido = validarCorreo(correo);
  const edadValida = validarEdad(edad);
  const entradaValida = validarEntrada(entrada);

  const reglasCumplidas = [
    nombreValido,
    correoValido,
    edadValida,
    entradaValida,
  ].filter(Boolean).length;

  const handleEnviar = () => {
    setHaIntentadoEnviar(true);
    setMensajeError('');

    if (!nombreValido) {
      setMensajeError('Por favor ingresa un nombre completo válido (mínimo 3 letras).');
      return;
    }

    if (!correoValido) {
      setMensajeError('Ingresa una dirección de correo electrónico válida (ejemplo@dominio.com).');
      return;
    }

    if (!edadValida) {
      setMensajeError('Debes tener 18 años o más para inscribirte a este evento.');
      return;
    }

    if (!entradaValida) {
      setMensajeError('Selecciona el tipo de entrada que deseas adquirir.');
      return;
    }

    // Si todas las validaciones pasaron con éxito
    const entradaSeleccionada = TIPOS_ENTRADA.find((t) => t.id === entrada)?.titulo || entrada;
    const ticketCode = `EVT-${Math.floor(100000 + Math.random() * 900000)}`;

    setDatosConfirmados({
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      edad: edad.trim(),
      entrada: entradaSeleccionada,
      ticketCode,
    });
    setRegistroExitoso(true);
  };

  const handleReiniciar = () => {
    setNombre('');
    setCorreo('');
    setEdad('');
    setEntrada('');
    setHaIntentadoEnviar(false);
    setMensajeError('');
    setRegistroExitoso(false);
    setDatosConfirmados(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER PRINCIPAL */}
          <View style={styles.header}>
            <View style={styles.badgeTop}>
              <Text style={styles.badgeTopText}>ACTIVIDAD INDIVIDUAL • S10</Text>
            </View>
            <Text style={styles.title}>Inscripción a Evento</Text>
            <Text style={styles.subtitle}>
              Tech Summit 2026 • Completa tus datos para reservar tu pase
            </Text>
          </View>

          {/* ESTADO DE ÉXITO (CONFIRMACIÓN) O FORMULARIO ACTIVO */}
          {registroExitoso && datosConfirmados ? (
            <View style={styles.successCard}>
              <View style={styles.successIconContainer}>
                <Text style={styles.successIcon}>✓</Text>
              </View>

              <Text style={styles.successTitle}>¡Inscripción Exitosa!</Text>
              <Text style={styles.successDescription}>
                Tu cupo para el Tech Summit 2026 ha sido reservado correctamente.
              </Text>

              {/* TICKET DIGITAL RESUMEN */}
              <View style={styles.ticketBox}>
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketTag}>PASE DIGITAL</Text>
                  <Text style={styles.ticketCode}>#{datosConfirmados.ticketCode}</Text>
                </View>

                <View style={styles.ticketDivider} />

                <View style={styles.ticketRow}>
                  <Text style={styles.ticketLabel}>Asistente:</Text>
                  <Text style={styles.ticketValue}>{datosConfirmados.nombre}</Text>
                </View>

                <View style={styles.ticketRow}>
                  <Text style={styles.ticketLabel}>Correo:</Text>
                  <Text style={styles.ticketValue}>{datosConfirmados.correo}</Text>
                </View>

                <View style={styles.ticketRow}>
                  <Text style={styles.ticketLabel}>Edad:</Text>
                  <Text style={styles.ticketValue}>{datosConfirmados.edad} años</Text>
                </View>

                <View style={styles.ticketRow}>
                  <Text style={styles.ticketLabel}>Entrada:</Text>
                  <Text style={[styles.ticketValue, { color: colors.primary, fontWeight: '800' }]}>
                    {datosConfirmados.entrada}
                  </Text>
                </View>
              </View>

              <AppButton
                title="Registrar otra inscripción"
                variant="outline"
                onPress={handleReiniciar}
                style={{ marginTop: 8 }}
              />
            </View>
          ) : (
            <>
              {/* TARJETA DEL FORMULARIO */}
              <View style={styles.formCard}>
                <Text style={styles.cardTitle}>Datos del Asistente</Text>
                <Text style={styles.cardSubtitle}>
                  Por favor llena los siguientes campos requeridos
                </Text>

                {/* CAMPO 1: NOMBRE COMPLETO */}
                <AppInput
                  label="Nombre completo"
                  placeholder="Ej. Carlos Mendoza Ramos"
                  value={nombre}
                  onChangeText={(val) => {
                    setNombre(val);
                    if (haIntentadoEnviar) setMensajeError('');
                  }}
                  icon="👤"
                  isValid={nombreValido}
                  hasError={haIntentadoEnviar && !nombreValido}
                  errorMessage="El nombre es obligatorio (mínimo 3 letras)"
                  autoCapitalize="words"
                />

                {/* CAMPO 2: CORREO ELECTRÓNICO */}
                <AppInput
                  label="Correo electrónico"
                  placeholder="ejemplo@correo.com"
                  value={correo}
                  onChangeText={(val) => {
                    setCorreo(val);
                    if (haIntentadoEnviar) setMensajeError('');
                  }}
                  icon="✉️"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  isValid={correoValido}
                  hasError={haIntentadoEnviar && !correoValido}
                  errorMessage="Ingresa un correo válido con @ y dominio"
                />

                {/* CAMPO 3: EDAD */}
                <AppInput
                  label="Edad"
                  placeholder="Ej. 24"
                  value={edad}
                  onChangeText={(val) => {
                    setEdad(val);
                    if (haIntentadoEnviar) setMensajeError('');
                  }}
                  icon="🎂"
                  keyboardType="numeric"
                  maxLength={3}
                  isValid={edadValida}
                  hasError={haIntentadoEnviar && !edadValida}
                  errorMessage="Debes tener 18 años o más"
                />

                {/* CAMPO 4: TIPO DE ENTRADA (SELECTOR VISUAL) */}
                <View style={styles.ticketSelectContainer}>
                  <View style={styles.ticketSelectHeader}>
                    <Text style={styles.ticketSelectLabel}>Tipo de Entrada</Text>
                    {entradaValida && (
                      <Text style={styles.validBadge}>✓ Seleccionada</Text>
                    )}
                  </View>

                  <View style={styles.ticketOptions}>
                    {TIPOS_ENTRADA.map((item) => {
                      const isSelected = entrada === item.id;
                      return (
                        <Pressable
                          key={item.id}
                          style={[
                            styles.ticketOptionCard,
                            isSelected && styles.ticketOptionSelected,
                          ]}
                          onPress={() => {
                            setEntrada(item.id);
                            if (haIntentadoEnviar) setMensajeError('');
                          }}
                        >
                          <View style={styles.ticketOptionTop}>
                            <View style={styles.ticketOptionRadio}>
                              <View
                                style={[
                                  styles.radioInner,
                                  isSelected && styles.radioInnerActive,
                                ]}
                              />
                            </View>
                            <Text
                              style={[
                                styles.ticketOptionTitle,
                                isSelected && styles.ticketOptionTitleSelected,
                              ]}
                            >
                              {item.titulo}
                            </Text>
                            <Text
                              style={[
                                styles.ticketOptionPrice,
                                isSelected && styles.ticketOptionPriceSelected,
                              ]}
                            >
                              {item.precio}
                            </Text>
                          </View>
                          <Text style={styles.ticketOptionDesc}>{item.desc}</Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  {haIntentadoEnviar && !entradaValida && (
                    <Text style={styles.errorText}>⚠ Debes seleccionar un tipo de entrada</Text>
                  )}
                </View>

                {/* MENSAJE DE ERROR GLOBAL ANTE INTENTO FALLIDO */}
                {mensajeError !== '' && (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerIcon}>⚠️</Text>
                    <View style={styles.errorBannerContent}>
                      <Text style={styles.errorBannerTitle}>Formulario incompleto</Text>
                      <Text style={styles.errorBannerText}>{mensajeError}</Text>
                    </View>
                  </View>
                )}

                {/* BOTÓN DE ACCIÓN */}
                <AppButton
                  title="Completar Inscripción"
                  icon="🎟️"
                  onPress={handleEnviar}
                  style={{ marginTop: 8 }}
                />
              </View>

              {/* PANEL DE SEGUIMIENTO DE VALIDACIONES EN VIVO */}
              <View style={styles.validationPanel}>
                <View style={styles.validationHeader}>
                  <View>
                    <Text style={styles.validationPanelTitle}>Reglas de Validación</Text>
                    <Text style={styles.validationPanelSubtitle}>
                      Monitoreo de requisitos en tiempo real
                    </Text>
                  </View>
                  <View style={styles.validationCounter}>
                    <Text style={styles.validationCounterText}>
                      {reglasCumplidas}/4
                    </Text>
                  </View>
                </View>

                <ValidationItem
                  title="1. Nombre completo"
                  detail="Obligatorio, mín. 3 caracteres sin números"
                  isValid={nombreValido}
                />
                <ValidationItem
                  title="2. Correo electrónico"
                  detail="Formato válido con @ y extensión de dominio"
                  isValid={correoValido}
                />
                <ValidationItem
                  title="3. Edad requerida"
                  detail="Mayor o igual a 18 años cumplidos"
                  isValid={edadValida}
                />
                <ValidationItem
                  title="4. Tipo de entrada"
                  detail="Seleccionar una categoría de pase"
                  isValid={entradaValida}
                />
              </View>
            </>
          )}

          {/* PIE DE PÁGINA */}
          <Text style={styles.footerNote}>
            Desarrollo de Aplicaciones Móviles • Expo + React Native
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Componente para filas de validación
function ValidationItem({
  title,
  detail,
  isValid,
}: {
  title: string;
  detail: string;
  isValid: boolean;
}) {
  return (
    <View style={styles.valItem}>
      <View
        style={[
          styles.valCircle,
          isValid ? styles.valCircleValid : styles.valCirclePending,
        ]}
      >
        <Text style={isValid ? styles.valIconValid : styles.valIconPending}>
          {isValid ? '✓' : '○'}
        </Text>
      </View>

      <View style={styles.valContent}>
        <Text style={styles.valTitle}>{title}</Text>
        <Text style={styles.valDetail}>{detail}</Text>
      </View>

      <View
        style={[
          styles.valBadge,
          isValid ? styles.valBadgeValid : styles.valBadgePending,
        ]}
      >
        <Text
          style={[
            styles.valBadgeText,
            isValid ? styles.valBadgeTextValid : styles.valBadgeTextPending,
          ]}
        >
          {isValid ? 'CUMPLIDO' : 'PENDIENTE'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 16,
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    marginBottom: 20,
  },
  badgeTop: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    marginBottom: 8,
  },
  badgeTopText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: theme.fontSize.hero,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: theme.fontSize.body,
    color: colors.textMuted,
    lineHeight: 20,
  },

  /* CARD PRINCIPAL */
  formCard: {
    backgroundColor: colors.card,
    borderRadius: theme.radius.large,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    ...theme.shadows.card,
  },
  cardTitle: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 18,
  },

  /* ENTRADAS SELECTOR */
  ticketSelectContainer: {
    marginBottom: 18,
  },
  ticketSelectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketSelectLabel: {
    fontSize: theme.fontSize.body,
    fontWeight: '700',
    color: colors.text,
  },
  validBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  ticketOptions: {
    gap: 8,
  },
  ticketOptionCard: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: theme.radius.medium,
    padding: 12,
    backgroundColor: '#F8FAFC',
  },
  ticketOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  ticketOptionTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketOptionRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.textSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  radioInnerActive: {
    backgroundColor: colors.primary,
  },
  ticketOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  ticketOptionTitleSelected: {
    color: colors.primary,
  },
  ticketOptionPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
  },
  ticketOptionPriceSelected: {
    color: colors.primary,
  },
  ticketOptionDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 28,
    marginTop: 2,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '600',
    marginTop: 6,
  },

  /* ERROR BANNER */
  errorBanner: {
    flexDirection: 'row',
    backgroundColor: colors.errorBg,
    borderColor: colors.errorBorder,
    borderWidth: 1,
    borderRadius: theme.radius.medium,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorBannerIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  errorBannerContent: {
    flex: 1,
  },
  errorBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.errorDark,
    marginBottom: 2,
  },
  errorBannerText: {
    fontSize: 12,
    color: colors.error,
    lineHeight: 16,
  },

  /* CONFIRMACIÓN EXITOSA */
  successCard: {
    backgroundColor: colors.card,
    borderRadius: theme.radius.large,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.successBorder,
    alignItems: 'center',
    marginBottom: 20,
    ...theme.shadows.card,
  },
  successIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.success,
    marginBottom: 14,
  },
  successIcon: {
    fontSize: 28,
    color: colors.success,
    fontWeight: '900',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.successDark,
    marginBottom: 6,
  },
  successDescription: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  ticketBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 18,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ticketTag: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
  },
  ticketCode: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  ticketDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ticketLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  ticketValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '700',
    maxWidth: '65%',
    textAlign: 'right',
  },

  /* PANEL DE VALIDACIONES */
  validationPanel: {
    backgroundColor: colors.card,
    borderRadius: theme.radius.large,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    ...theme.shadows.subtle,
  },
  validationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  validationPanelTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  validationPanelSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  validationCounter: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.small,
  },
  validationCounterText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  valItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  valCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  valCircleValid: {
    backgroundColor: colors.successBg,
  },
  valCirclePending: {
    backgroundColor: '#F1F5F9',
  },
  valIconValid: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '800',
  },
  valIconPending: {
    color: colors.textSubtle,
    fontSize: 14,
  },
  valContent: {
    flex: 1,
  },
  valTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  valDetail: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  valBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  valBadgeValid: {
    backgroundColor: colors.successBg,
  },
  valBadgePending: {
    backgroundColor: '#F1F5F9',
  },
  valBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  valBadgeTextValid: {
    color: colors.successDark,
  },
  valBadgeTextPending: {
    color: colors.textSubtle,
  },

  /* FOOTER */
  footerNote: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSubtle,
    marginTop: 10,
  },
});