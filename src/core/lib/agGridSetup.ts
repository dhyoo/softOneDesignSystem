/**
 * SoftOne Design System - ag-Grid Setup
 * ag-Grid v31+ 모듈 등록
 *
 * ag-Grid v31 이후부터는 사용할 모듈을 명시적으로 등록해야 합니다.
 * 이 파일을 앱 진입점(main.tsx)에서 가장 먼저 import 하세요.
 */

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

// 모든 Community 모듈 등록
ModuleRegistry.registerModules([AllCommunityModule]);

console.log("[SDS] ag-Grid Community modules registered.");

