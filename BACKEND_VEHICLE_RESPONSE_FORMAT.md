# تنسيق Response المطلوب من Backend لعرض بيانات المركبة

## Endpoint
`GET /vehicles/composite/{id}`

## Response Structure المطلوب

يجب أن يكون الـ response بهذا التنسيق بالضبط:

```json
{
  "success": true,
  "message": "تم استرجاع المركبة بنجاح",
  "data": {
    "id": 49,
    "driver_id": 49,
    "make": "لبلا",
    "model": "fff",
    "year": 2020,
    "color": "20202",
    "vehicle_type": "composite",
    "vehicle_type_id": 2,
    "part_type": "composite",
    "display_name": "لبلا fff (رأس + مقطورة)",
    "driver": {
      "id": 49,
      "name": "Abdullah Ay66man",
      "email": "adffmin@example.com"
    },
    "head": {
      "id": 49,
      "driver_id": 49,
      "make": "لبلا",
      "model": "fff",
      "year": 2020,
      "color": "20202",
      "license_plate": "8784521",
      "vin": null,
      "chassis_number": "51111111117111111",
      "engine_number": "2121287",
      "part_type": "head",
      "head_id": null,
      "vehicle_type": {
        "id": 2,
        "name": "SUV",
        "name_ar": "سيارات الدفع الرباعي"
      },
      "fuel_type": null,
      "transmission": "automatic",
      "doors": 4,
      "seats": 4,
      "number_of_axles": 7,
      "max_load": "10.00",
      "length": "119.00",
      "is_primary": false,
      "status": "inactive",
      "verification_status": "pending",
      "verification_date": null,
      "verified_by": null,
      "verifier": null,
      "verification_notes": null,
      "registration_number": null,
      "registration_expiry": null,
      "registration_state": null,
      "insurance_provider": null,
      "insurance_policy_number": null,
      "insurance_expiry": null,
      "inspection_date": null,
      "inspection_expiry": null,
      "inspection_certificate": null,
      "mileage": null,
      "condition_rating": null,
      "last_maintenance_date": null,
      "next_maintenance_due": null,
      "photos": {
        "license_front": "http://localhost:3000/storage/vehicles/49/head/e799ee4b-68b3-4c29-90ef-3948aac95b0c_license_front.png",
        "license_back": "http://localhost:3000/storage/vehicles/49/head/a1502e55-a6ef-4f69-89ea-8f0211e88566_license_back.png",
        "four_sides": [
          "http://localhost:3000/storage/vehicles/49/head/0ffe2ddb-d4fa-44d9-b730-249e277006d4_side_0.png",
          "http://localhost:3000/storage/vehicles/49/head/f430e18b-3f51-4ea9-92c2-5c88d74b7a54_side_1.png",
          "http://localhost:3000/storage/vehicles/49/head/82df83da-11c8-4b3c-b17e-28111b246bf9_side_2.png",
          "http://localhost:3000/storage/vehicles/49/head/f40d24ac-1da6-4aff-845f-9ecba8e3470f_side_3.png"
        ]
      },
      "features": null,
      "notes": null,
      "created_by": 1,
      "creator": {
        "id": 1,
        "name": "Super Admin",
        "email": "superadmin@example.com"
      },
      "updated_by": 1,
      "updater": {
        "id": 1,
        "name": "Super Admin",
        "email": "superadmin@example.com"
      },
      "created_at": "2026-01-24T17:55:47+00:00",
      "updated_at": "2026-01-24T20:01:33+00:00"
    },
    "trailer": {
      "id": 50,
      "driver_id": 49,
      "make": "لبلا",
      "model": "2020",
      "year": 2020,
      "color": "20202",
      "license_plate": "24242454",
      "vin": null,
      "chassis_number": "12345678908945614",
      "engine_number": null,
      "part_type": "trailer",
      "head_id": 49,
      "vehicle_type": {
        "id": 2,
        "name": "SUV",
        "name_ar": "سيارات الدفع الرباعي"
      },
      "fuel_type": null,
      "transmission": "automatic",
      "doors": 4,
      "seats": 4,
      "number_of_axles": 8,
      "max_load": "10.00",
      "length": "11.00",
      "is_primary": false,
      "status": "inactive",
      "verification_status": "pending",
      "verification_date": null,
      "verified_by": null,
      "verifier": null,
      "verification_notes": null,
      "registration_number": null,
      "registration_expiry": null,
      "registration_state": null,
      "insurance_provider": null,
      "insurance_policy_number": null,
      "insurance_expiry": null,
      "inspection_date": null,
      "inspection_expiry": null,
      "inspection_certificate": null,
      "mileage": null,
      "condition_rating": null,
      "last_maintenance_date": null,
      "next_maintenance_due": null,
      "photos": {
        "license_front": "http://localhost:3000/storage/vehicles/49/trailer/f5d1b7e4-cda2-4339-967e-2e3a50a4a2b5_license_front.png",
        "license_back": "http://localhost:3000/storage/vehicles/49/trailer/84805aae-e4f9-46aa-915a-074b92d5e23f_license_back.png"
      },
      "features": null,
      "notes": null,
      "created_by": 1,
      "creator": {
        "id": 1,
        "name": "Super Admin",
        "email": "superadmin@example.com"
      },
      "updated_by": 1,
      "updater": {
        "id": 1,
        "name": "Super Admin",
        "email": "superadmin@example.com"
      },
      "created_at": "2026-01-24T17:55:47+00:00",
      "updated_at": "2026-01-24T20:01:33+00:00"
    },
    "total_axles": 15,
    "total_max_load": "20.00",
    "total_length": "130.00",
    "status": "inactive",
    "verification_status": "pending",
    "verification_date": null,
    "verified_by": null,
    "verifier": null,
    "verification_notes": null,
    "registration_number": null,
    "registration_expiry": null,
    "registration_state": null,
    "insurance_provider": null,
    "insurance_policy_number": null,
    "insurance_expiry": null,
    "inspection_date": null,
    "inspection_expiry": null,
    "inspection_certificate": null,
    "mileage": null,
    "condition_rating": null,
    "last_maintenance_date": null,
    "next_maintenance_due": null,
    "fuel_type": null,
    "transmission": "automatic",
    "doors": 4,
    "seats": 4,
    "is_primary": false,
    "features": null,
    "notes": null,
    "created_by": 1,
    "creator": {
      "id": 1,
      "name": "Super Admin",
      "email": "superadmin@example.com"
    },
    "updated_by": 1,
    "updater": {
      "id": 1,
      "name": "Super Admin",
      "email": "superadmin@example.com"
    },
    "created_at": "2026-01-24T17:55:47+00:00",
    "updated_at": "2026-01-24T20:01:33+00:00"
  },
  "request_id": "b5dd1109-f0e5-4e11-96c4-98ef62cc7d12"
}
```

## النقاط المهمة:

### 1. الـ Top Level يجب أن يحتوي على:
- ✅ `vehicle_type: "composite"` - **مهم جداً**
- ✅ `head` object كامل
- ✅ `trailer` object كامل
- ✅ `make`, `model`, `year`, `color` في الـ top level
- ✅ `driver` object
- ✅ `vehicle_type_id` في الـ top level
- ✅ `display_name` (اختياري، لكن الأفضل إضافته)
- ✅ `total_axles`, `total_max_load`, `total_length` (اختياري، لكن الأفضل إضافته)

### 2. الـ Head Object يجب أن يحتوي على:
- ✅ `id`, `license_plate`, `chassis_number`, `engine_number`
- ✅ `number_of_axles`, `max_load`, `length`
- ✅ `photos` object مع `license_front`, `license_back`, `four_sides`
- ✅ `model`, `year` (للتوافق مع الكود)

### 3. الـ Trailer Object يجب أن يحتوي على:
- ✅ `id`, `license_plate`, `chassis_number`, `engine_number`
- ✅ `number_of_axles`, `max_load`, `length`
- ✅ `photos` object مع `license_front`, `license_back`
- ✅ `model`, `year`

## الفرق بين Response الحالي والمطلوب:

### ❌ Response الحالي (المشكلة):
```json
{
  "data": {
    "head": {...},
    "trailer": {...}
    // لا يوجد vehicle_type في الـ top level
  }
}
```

### ✅ Response المطلوب:
```json
{
  "data": {
    "vehicle_type": "composite",  // ← هذا مهم جداً
    "make": "...",
    "model": "...",
    "year": 2020,
    "color": "...",
    "head": {...},
    "trailer": {...}
  }
}
```

## ملاحظات للـ Backend Developer:

1. **يجب إضافة `vehicle_type: "composite"` في الـ top level** من الـ response عندما تكون المركبة مركبة (لها head و trailer).

2. **يجب إضافة البيانات الأساسية** (`make`, `model`, `year`, `color`) في الـ top level أيضاً.

3. **يجب إضافة `vehicle_type_id`** في الـ top level.

4. **يجب إضافة `display_name`** في الـ top level (مثل: "لبلا fff (رأس + مقطورة)").

5. **يُفضل إضافة `total_axles`, `total_max_load`, `total_length`** في الـ top level لحسابها من head + trailer.

## مثال على الكود في Laravel:

```php
// في Controller
public function show($id)
{
    $head = Vehicle::where('id', $id)
        ->where('part_type', 'head')
        ->with(['driver', 'vehicle_type', 'creator', 'updater'])
        ->first();
    
    $trailer = Vehicle::where('head_id', $id)
        ->where('part_type', 'trailer')
        ->with(['driver', 'vehicle_type', 'creator', 'updater'])
        ->first();
    
    if (!$head || !$trailer) {
        return response()->json([
            'success' => false,
            'message' => 'Vehicle not found'
        ], 404);
    }
    
    // بناء الـ response
    $response = [
        'id' => $head->id,
        'driver_id' => $head->driver_id,
        'make' => $head->make,
        'model' => $head->model,
        'year' => $head->year,
        'color' => $head->color,
        'vehicle_type' => 'composite', // ← مهم جداً
        'vehicle_type_id' => $head->vehicle_type_id,
        'part_type' => 'composite',
        'display_name' => $head->make . ' ' . $head->model . ' (رأس + مقطورة)',
        'driver' => $head->driver,
        'head' => $head->toArray(),
        'trailer' => $trailer->toArray(),
        'total_axles' => $head->number_of_axles + $trailer->number_of_axles,
        'total_max_load' => (float)$head->max_load + (float)$trailer->max_load,
        'total_length' => (float)$head->length + (float)$trailer->length,
        'status' => $head->status,
        'verification_status' => $head->verification_status,
        'fuel_type' => $head->fuel_type,
        'transmission' => $head->transmission,
        'doors' => $head->doors,
        'seats' => $head->seats,
        'is_primary' => $head->is_primary,
        'created_at' => $head->created_at,
        'updated_at' => $head->updated_at,
        'created_by' => $head->created_by,
        'creator' => $head->creator,
        'updated_by' => $head->updated_by,
        'updater' => $head->updater,
    ];
    
    return response()->json([
        'success' => true,
        'message' => 'تم استرجاع المركبة بنجاح',
        'data' => $response
    ]);
}
```

## الخلاصة:

**المشكلة الرئيسية:** الـ response الحالي لا يحتوي على `vehicle_type: "composite"` في الـ top level.

**الحل:** إضافة `vehicle_type: "composite"` في الـ top level من الـ response عندما تكون المركبة مركبة (لها head و trailer).

