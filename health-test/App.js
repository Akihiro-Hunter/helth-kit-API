import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, NativeModules, Platform } from 'react-native';
import AppleHealthKitModule from 'react-native-health';

// 💡 ここが最大のポイント：新アーキテクチャ向けの「窓口」を強制的に探す
const AppleHealthKit = NativeModules.AppleHealthKit || AppleHealthKitModule;

export default function App() {
  const [status, setStatus] = useState('待機中...');

  const initHealth = () => {
    // 💡 デバッグ用：何が読み込まれているか画面に出す
    if (!AppleHealthKit) {
      setStatus('エラー: NativeModulesにAppleHealthKitが見つかりません');
      console.log("利用可能なモジュール:", Object.keys(NativeModules));
      return;
    }

    if (typeof AppleHealthKit.initHealthKit !== 'function') {
      setStatus('エラー: initHealthKitが関数ではありません');
      return;
    }

    const permissions = {
      permissions: {
        read: ["StepCount"],
        write: []
      }
    };

    AppleHealthKit.initHealthKit(permissions, (error) => {
      if (error) {
        setStatus('初期化失敗: ' + error);
      } else {
        setStatus('HealthKit 接続成功！許可画面を確認してください');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HealthKit テスト</Text>
      <Text style={styles.status}>{status}</Text>
      <Button title="HealthKitを初期化" onPress={initHealth} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  status: { fontSize: 16, color: 'blue', marginBottom: 30, textAlign: 'center' },
});