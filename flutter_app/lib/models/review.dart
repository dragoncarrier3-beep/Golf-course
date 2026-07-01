import '../core/scoring_engine.dart';

class CourseInfo {
  String courseName;
  String city;
  String state;
  String datePlayed;
  String reviewerName;
  String reviewerInitials;
  bool anonymous;
  String teeTime;
  String roundDuration;
  int holes;
  String pricePaid;
  String access;
  String handicapRange;
  String greensPunchStatus;
  String? placeId;

  CourseInfo({
    this.courseName = '',
    this.city = '',
    this.state = '',
    String? datePlayed,
    this.reviewerName = '',
    this.reviewerInitials = '',
    this.anonymous = false,
    this.teeTime = '',
    this.roundDuration = '',
    this.holes = 18,
    this.pricePaid = '',
    this.access = '',
    this.handicapRange = '',
    this.greensPunchStatus = '',
    this.placeId,
  }) : datePlayed = datePlayed ?? DateTime.now().toIso8601String().split('T').first;

  Map<String, dynamic> toJson() => {
        'courseName': courseName,
        'city': city,
        'state': state,
        'datePlayed': datePlayed,
        'reviewerName': reviewerName,
        'reviewerInitials': reviewerInitials,
        'anonymous': anonymous,
        'teeTime': teeTime,
        'roundDuration': roundDuration,
        'holes': holes,
        'pricePaid': pricePaid,
        'access': access,
        'handicapRange': handicapRange,
        'greensPunchStatus': greensPunchStatus,
        'placeId': placeId,
      };

  factory CourseInfo.fromJson(Map<String, dynamic> json) => CourseInfo(
        courseName: json['courseName'] as String? ?? '',
        city: json['city'] as String? ?? '',
        state: json['state'] as String? ?? '',
        datePlayed: json['datePlayed'] as String?,
        reviewerName: json['reviewerName'] as String? ?? '',
        reviewerInitials: json['reviewerInitials'] as String? ?? '',
        anonymous: json['anonymous'] as bool? ?? false,
        teeTime: json['teeTime'] as String? ?? '',
        roundDuration: json['roundDuration'] as String? ?? '',
        holes: json['holes'] as int? ?? 18,
        pricePaid: json['pricePaid'] as String? ?? '',
        access: json['access'] as String? ?? '',
        handicapRange: json['handicapRange'] as String? ?? '',
        greensPunchStatus: json['greensPunchStatus'] as String? ?? '',
        placeId: json['placeId'] as String?,
      );
}

class Review {
  final String id;
  CourseInfo courseInfo;
  Map<String, int> scoreCategories;
  Map<String, String> descriptiveProfile;
  List<String> amenities;
  Map<String, String> notes;
  double weightedScore;
  String letterGrade;
  String syncStatus;
  bool isDraft;
  final String createdAt;
  String updatedAt;
  int currentStep;

  Review({
    required this.id,
    required this.courseInfo,
    this.scoreCategories = const {},
    this.descriptiveProfile = const {},
    this.amenities = const [],
    this.notes = const {},
    this.weightedScore = 0,
    this.letterGrade = 'F',
    this.syncStatus = 'local',
    this.isDraft = true,
    required this.createdAt,
    required this.updatedAt,
    this.currentStep = 0,
  });

  Review recalculate(List<CategoryWeight> config) {
    final score = calculateWeightedScore(scoreCategories, config);
    return copyWith(
      weightedScore: score,
      letterGrade: scoreToLetterGrade(score),
    );
  }

  Review copyWith({
    CourseInfo? courseInfo,
    Map<String, int>? scoreCategories,
    Map<String, String>? descriptiveProfile,
    List<String>? amenities,
    Map<String, String>? notes,
    double? weightedScore,
    String? letterGrade,
    String? syncStatus,
    bool? isDraft,
    String? updatedAt,
    int? currentStep,
  }) =>
      Review(
        id: id,
        courseInfo: courseInfo ?? this.courseInfo,
        scoreCategories: scoreCategories ?? this.scoreCategories,
        descriptiveProfile: descriptiveProfile ?? this.descriptiveProfile,
        amenities: amenities ?? this.amenities,
        notes: notes ?? this.notes,
        weightedScore: weightedScore ?? this.weightedScore,
        letterGrade: letterGrade ?? this.letterGrade,
        syncStatus: syncStatus ?? this.syncStatus,
        isDraft: isDraft ?? this.isDraft,
        createdAt: createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
        currentStep: currentStep ?? this.currentStep,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'courseInfo': courseInfo.toJson(),
        'scoreCategories': scoreCategories,
        'descriptiveProfile': descriptiveProfile,
        'amenities': amenities,
        'notes': notes,
        'weightedScore': weightedScore,
        'letterGrade': letterGrade,
        'syncStatus': syncStatus,
        'isDraft': isDraft,
        'createdAt': createdAt,
        'updatedAt': updatedAt,
        'currentStep': currentStep,
      };

  Map<String, dynamic> toFirestore() => {
        'course_info': courseInfo.toJson(),
        'score_categories': scoreCategories,
        'descriptive_profile': descriptiveProfile,
        'amenities': amenities,
        'notes': notes,
        'weighted_score': weightedScore,
        'letter_grade': letterGrade,
        'sync_status': syncStatus,
      };

  factory Review.fromJson(Map<String, dynamic> json) => Review(
        id: json['id'] as String,
        courseInfo: CourseInfo.fromJson(json['courseInfo'] as Map<String, dynamic>),
        scoreCategories: Map<String, int>.from(
          (json['scoreCategories'] as Map?)?.map((k, v) => MapEntry(k as String, v as int)) ?? {},
        ),
        descriptiveProfile: Map<String, String>.from(
          (json['descriptiveProfile'] as Map?)?.map((k, v) => MapEntry(k as String, v as String)) ?? {},
        ),
        amenities: List<String>.from(json['amenities'] as List? ?? []),
        notes: Map<String, String>.from(
          (json['notes'] as Map?)?.map((k, v) => MapEntry(k as String, v as String)) ?? {},
        ),
        weightedScore: (json['weightedScore'] as num?)?.toDouble() ?? 0,
        letterGrade: json['letterGrade'] as String? ?? 'F',
        syncStatus: json['syncStatus'] as String? ?? 'local',
        isDraft: json['isDraft'] as bool? ?? true,
        createdAt: json['createdAt'] as String,
        updatedAt: json['updatedAt'] as String,
        currentStep: json['currentStep'] as int? ?? 0,
      );

  static Review seedPebble(String now) => Review(
        id: 'seed-review-pebble',
        courseInfo: CourseInfo(
          courseName: 'Pebble Beach Golf Links',
          city: 'Pebble Beach',
          state: 'CA',
          datePlayed: '2025-06-15',
          reviewerName: 'Demo Reviewer',
          reviewerInitials: 'DR',
          holes: 18,
          access: 'Public',
          pricePaid: r'$595',
          roundDuration: '4h 30m',
        ),
        scoreCategories: const {
          'greens_quality': 9,
          'fairways': 9,
          'value': 7,
          'rough': 8,
          'practice_facility': 9,
          'tee_boxes': 9,
          'fringes': 8,
          'bunkers': 9,
          'staff_operations': 9,
          'layout_fun': 10,
        },
        descriptiveProfile: const {
          'greenSpeed': 'Fast',
          'difficulty': 'Challenging',
          'forgiveness': 'Punishing',
        },
        amenities: const ['Full Range', 'Restaurant'],
        notes: const {
          'bestThing': 'Iconic coastal holes with breathtaking views',
          'biggestIssue': 'Premium pricing',
          'weatherNotes': 'Clear skies, light ocean breeze',
        },
        weightedScore: 8.7,
        letterGrade: 'A-',
        syncStatus: 'submitted',
        isDraft: false,
        createdAt: now,
        updatedAt: now,
        currentStep: 6,
      );

  static Review seedAugustaDraft(String now) => Review(
        id: 'seed-draft-augusta',
        courseInfo: CourseInfo(
          courseName: 'Augusta National Golf Club',
          city: 'Augusta',
          state: 'GA',
          reviewerName: 'Demo Reviewer',
          reviewerInitials: 'DR',
          holes: 18,
          access: 'Private',
        ),
        scoreCategories: const {
          'greens_quality': 10,
          'fairways': 10,
          'value': 8,
          'rough': 9,
          'practice_facility': 10,
          'tee_boxes': 10,
          'fringes': 9,
          'bunkers': 9,
          'staff_operations': 10,
          'layout_fun': 10,
        },
        weightedScore: 9.5,
        letterGrade: 'A+',
        syncStatus: 'local',
        isDraft: true,
        createdAt: now,
        updatedAt: now,
        currentStep: 2,
      );
}
